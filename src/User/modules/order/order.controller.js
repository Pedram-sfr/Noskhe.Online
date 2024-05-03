const { model, default: mongoose } = require("mongoose");
const OrderService = require("./order.service")
const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const { stringToObject } = require("../../../common/function/stringToObject");
class OrderController{
    #service
    constructor(){
        autoBind(this);
        this.#service = OrderService
    }
    async add(req,res,next){
        try {
            const {list} = req.body;
            const otc = stringToObject(list[0])
            return res.status(200).json({
                statusCode: 200,
                data: {
                    otc
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }


}

module.exports = new OrderController();