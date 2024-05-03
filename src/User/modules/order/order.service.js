const autoBind = require("auto-bind");
const OrderModel = require("./order.model");
const createHttpError = require("http-errors");
const { OrderMessages } = require("./order.messages");

class OrderService{
    #model;
    constructor(){
        autoBind(this);
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
}


module.exports = new OrderService();
