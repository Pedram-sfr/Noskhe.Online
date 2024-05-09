const FactorService = require("./factor.service")
const autoBind = require("auto-bind");
const puppeteer = require("puppeteer");
const fs = require("fs")
const createHttpError = require("http-errors");
const { stringToObject } = require("../../../common/function/stringToObject");
const FactorModel = require("./factor.model");
const { render } = require("ejs");
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
            console.log(id);
            res.render("invoice.ejs")
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new FactorController();