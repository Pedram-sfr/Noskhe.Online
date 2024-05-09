const FactorService = require("./factor.service")
const autoBind = require("auto-bind");
const { dateToJalali, createPdf } = require("../../../common/function/function");
class FactorController{
    #service
    constructor(){
        autoBind(this);
        this.#service = FactorService
    }
    async createFactor(req,res,next){
        try {
            const {userId: pharmacyId} = req.pharmacyuser
            const {user, orderId, addressId, drugs} = req.body;
            const drug = JSON.parse(drugs);
            let totalPrice = 0;
            for (let i = 0; i < drug.length; i++) {
                totalPrice += drug[i]["total"];
            }
            const data = {pharmacyId,userId: user, orderId, addressId, drugs: drug, totalPrice,shippingCost: 20000};
            await this.#service.createFactor(data)
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: "success"
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async orderList(req,res,next){
        try {
            const {userId} = req.pharmacyuser
            const order = await this.#service.orderListForPharmacy(userId);
            return res.status(200).json({
                statusCode: 200,
                data: {
                   order
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async order(req,res,next){
        try {
            const {userId} = req.pharmacyuser
            const {orderId} = req.params
        console.log(orderId);
            const order = await this.#service.orderForPharmacy(userId,orderId);
            return res.status(200).json({
                statusCode: 200,
                data: {
                   order
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async pdf(req,res,next){
        try {
            const {id} = req.params
            const data = await this.#service.findFactorForPrint(id);
            const factor = data[0]
            const {date, time} = dateToJalali(factor.createdAt)
            factor.time = time
            factor.date = date
            //createPdf(factor)
            return res.render("invoice.ejs",{factor})

        } catch (error) {
            next(error)
        }
    }

}

module.exports = new FactorController();