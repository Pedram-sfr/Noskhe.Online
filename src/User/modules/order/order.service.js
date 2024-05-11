const autoBind = require("auto-bind");
const OrderModel = require("./order.model");
const createHttpError = require("http-errors");
const { OrderMessages } = require("./order.messages");
const PharmacyUserModel = require("../../../Pharmacy/modules/user/pharmacyUser.model");
const PharmacyOrderModel = require("./pharmacyOrder.model");

class OrderService{
    #model;#pharmModel;
    constructor(){
        autoBind(this);
        this.#pharmModel = PharmacyUserModel
        this.#model = OrderModel
    }
    async createOrder(ord){
        const res = await this.#model.create(ord);
        if(!res) throw createHttpError.InternalServerError("خطای سرور")
        return res
    }
    async addOTC(orderId,userId,ord){
        const res = await this.#model.updateOne({_id: orderId,userId},{
            $push:{
                otc: ord
            }
        });
        if(res.modifiedCount == 0) throw createHttpError.InternalServerError(ord)
        return res
    }
    async addUploadPrescription(orderId,userId,data){
        const res = await this.#model.updateOne({_id: orderId,userId},{
            $push:{
                uploadPrescription: data
            }
        });
        if(res.modifiedCount == 0) throw createHttpError.InternalServerError(data)
        return res
    }
    async addElecPrescription(orderId,userId,data){
        const res = await this.#model.updateOne({_id: orderId,userId},{
            $push:{
                elecPrescription: data
            }
        });
        if(res.modifiedCount == 0) throw createHttpError.InternalServerError(data)
        return res
    }
    async addOrderToPharmacy(coordinate,orderId){
        const pharm = await this.calDistanceCordinate(coordinate);
        let resualt;
        if(pharm.length == 1)
            resualt = await PharmacyOrderModel.create({orderId,pharmacyId: pharm[0],priority: [pharm[1]]});
        else if(pharm.length == 2)
            resualt = await PharmacyOrderModel.create({orderId,pharmacyId: pharm[0],priority: [pharm[1]]});
        else if(pharm.length == 3)
            resualt = await PharmacyOrderModel.create({orderId,pharmacyId: pharm[0],priority: [pharm[1],pharm[2]]});
        else if(pharm.length == 0)
            throw createHttpError.NotFound("داروخانه ای در محدوده شما یافت نشد")
        return resualt
    }
    async notAcceptOrderToPharmacy(id){
        const pharm = await PharmacyOrderModel.findById(id);
        let resualt;
        if(pharm.priority.length == 1)
            resualt = await PharmacyOrderModel.updateOne({_id: id},{pharmacyId: pharm.priority[0],priority: []});
        else if(pharm.priority.length == 2)
            resualt = await PharmacyOrderModel.updateOne({_id: id},{pharmacyId: pharm.priority[0],priority: [pharm.priority[1]]});
        else if(pharm.priority.length == 3)
            resualt = await PharmacyOrderModel.updateOne({_id: id},{pharmacyId: pharm.priority[0],priority: [pharm.priority[1],pharm.priority[2]]});
        else if(pharm.priority.length == 0)
            throw createHttpError.NotAcceptable("سفارش شما پذیرفته نشد")
        return resualt
    }
    
    async calDistanceCordinate(cor){
        // const data = await this.#pharmModel.aggregate([
        //    { $geoNear: {
        //         near: { type: "Point", coordinates: cor},
        //         spherical: true,
        //         distanceField: "calculatedDistance",
        //         maxDistance: 7000,
        //         key: "location"
        //     }}
        // ])
        const data = await this.#pharmModel.find(
            {"location.coordinates":{
                $geoWithin:{
                    $centerSphere:[
                        cor, 2/6378.1
                    ]
                }
            }}
        )
        return data;
    }
}


module.exports = new OrderService();
