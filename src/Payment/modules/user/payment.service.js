const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const FactorModel = require("../../../Pharmacy/modules/factor/factor.model");
const { Types } = require("mongoose");
const { dateToJalali } = require("../../../common/function/function");
const PaymentModel = require("./payment.model");

class PaymentService{
    #model;
    #factorModel;
    constructor(){
        autoBind(this);
        this.#model = PaymentModel;
        this.#factorModel = FactorModel;
    }
    

}


module.exports = new PaymentService();
