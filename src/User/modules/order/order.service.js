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

}


module.exports = new OrderService();
