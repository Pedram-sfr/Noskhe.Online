const autoBind = require("auto-bind");
const FactorModel = require("./factor.model");
const createHttpError = require("http-errors");
const OrderModel = require("../../../User/modules/order/order.model");
const { Types } = require("mongoose");

class FactorService{
    #model;
    #orderModel
    constructor(){
        autoBind(this);
        this.#model = FactorModel
        this.#orderModel = OrderModel
    }
    
    async orderListForPharmacy(pharmId){
        const order = await this.#orderModel.find(
            {pharmId},
            {accepted: 0,uploadPrescription: 0,otc: 0,pharmId: 0, elecPrescription: 0,userId: 0,addressId: 0,status: 0,updatedAt: 0}
        )
        if(!order) throw createHttpError.NotFound("لیست سفارشات خالی است")
        return order;
    }
    async orderForPharmacy(pharmId,orderId){
        const order = await this.#orderModel.aggregate([
            {$match: {_id: new Types.ObjectId(orderId),pharmId: new Types.ObjectId(pharmId)}},
            {$lookup: {
                from: "addresses",
                foreignField: "_id",
                localField: "addressId",
                as: "address"
            }},
            {
                $unwind: {
                    path: "$address",
                    preserveNullAndEmptyArrays: true
                }
            }]
        )
        console.log(order);
        if(!order) throw createHttpError.NotFound("لیست سفارشات خالی است")
        return order;
    }
    async createFactor(data){
        const res = await this.#model.create(data)
        if(!res) throw createHttpError.InternalServerError("خطای سرور")
        return res
    } 
    async findFactorForPrint(factorId){
        const fc = await this.#model.findById(factorId)
        if(!fc) throw createHttpError.NotFound("یافت نشد")
        const factor = await this.#model.aggregate([
            {$match: {_id: new Types.ObjectId(factorId)}},
            {$lookup: {
                from: "pharmacyusers",
                foreignField: "_id",
                localField: "pharmacyId",
                as: "pharmacy"
            }},
            {$lookup: {
                from: "orders",
                foreignField: "_id",
                localField: "orderId",
                as: "order"
            }},
            {
                $unwind: {
                    path: "$pharmacy",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$order",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    pharmacyName: "$pharmacy.pharmacyName",
                    elecPrescription: "$order.elecPrescription"
                }
            },
            {
                $project:{
                    pharmacy: 0 ,
                    shippingCost: 0,
                    sendStatus:0,
                    order: 0,
                    orderId: 0,
                    pharmacyId: 0,
                    updatedAt: 0,
                    userId: 0,
                    addressId: 0
                }
            }]
        )
        return factor;
    }

}


module.exports = new FactorService();
