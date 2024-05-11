const FactorService = require("./factor.service")
const autoBind = require("auto-bind");
const { dateToJalali, createPdf, codeGen, isFalse } = require("../../../common/function/function");
const OrderModel = require("../../../User/modules/order/order.model");
const { addWalletDetail } = require("../../../Wallet/modules/order/wallet.service");
const createHttpError = require("http-errors");
const PharmacyOrderModel = require("../../../User/modules/order/pharmacyOrder.model");
class FactorController{
    #service
    constructor(){
        autoBind(this);
        this.#service = FactorService
    }
    async createFactor(req,res,next){
        try {
            const {userId: pharmacyId} = req.pharmacyuser
            const { orderId, drugs} = req.body;
            const order = await OrderModel.findById({_id: orderId})
            const drug = JSON.parse(drugs);
            let totalPrice = 0;
            for (let i = 0; i < drug.length; i++) {
                totalPrice += drug[i]["total"];
            }
            const data = {invoiceId: codeGen(),pharmacyId,userId: order.userId, orderId, addressId: order.addressId, drugs: drug, totalPrice,shippingCost: 20000};
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
    async removeDrugFromFactor(req,res,next){
        try {
            const {userId} = req.pharmacyuser
            const {invoiceId,drug} = req.body;
            const drugs = JSON.parse(drug);
            let total = 0,data = {},phData= {};
            for (let i = 0; i < drugs.length; i++) {
                total += await this.#service.deleteDrugInFactor(userId,invoiceId,drugs[i]);
            }
            const factor = await this.#service.findFactor(invoiceId)
            console.log(factor.drugs);
            if(factor.drugs.length == 0){
                data = {RefNo: codeGen(),amount: total + factor.shippingCost,invoiceId,description: `اصلاحیه فاکتور شماره ${invoiceId}`,state: "برگشت به کیف پول",status: true}
                factor.active = false;
            }else{
                data = {RefNo: codeGen(),amount: total,invoiceId,description: `اصلاحیه فاکتور شماره ${invoiceId}`,state: "برگشت به کیف پول",status: true}
            }
            phData = {RefNo: codeGen(),amount: total,invoiceId,description: `اصلاحیه فاکتور شماره ${invoiceId}`,state: "کسر از کیف پول",status: false}
            factor.totalPrice = factor.totalPrice - total;
            factor.save();
            await addWalletDetail(factor.userId,data)
            await addWalletDetail(userId,phData)
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
    async acceptOrder(req,res,next){
        try {
            const {userId} = req.pharmacyuser
            const {id} = req.params
            const po = await PharmacyOrderModel.findOne({_id: id,pharmacyId: userId});
            if(!po) throw createHttpError.BadRequest()
            const order = await OrderModel.findById(po.orderId);
            if(!order) throw createHttpError.BadRequest()
            order.pharmId = userId;
            order.accepted = true;
            order.status = "پردازش توسط داروخانه"
            order.save();
            await PharmacyOrderModel.deleteOne({_id: id});
            return res.status(200).json({
                statusCode: 200,
                data: {
                   message: "OK"
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async newOrderList(req,res,next){
        try {
            const {userId} = req.pharmacyuser
            const pod = await this.#service.findNewOrder(userId)
            return res.status(200).json({
                statusCode: 200,
                data: {
                   pod
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
            if(isFalse(factor.active)) throw createHttpError.NotFound()
            const {date, time} = dateToJalali(factor?.createdAt)
            factor.time = time
            factor.date = date
            //createPdf(factor)
            return res.render("invoice.ejs",{factor})

        } catch (error) {
            next(error)
        }
    }
    async dis(req,res,next){
        try {
            const {coordinates} = req.body;
            const data = JSON.parse(coordinates)
            const dis = await this.#service.calDistanceCordinate(data)
            const len = dis.length;
            return res.status(200).json({
                statusCode: 200,
                data: {
                    len,
                    dis
                },
                error: null
            })

        } catch (error) {
            next(error)
        }
    }

}

module.exports = new FactorController();