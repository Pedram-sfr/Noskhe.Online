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


}


module.exports = new FactorService();
