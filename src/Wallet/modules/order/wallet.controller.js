const WalletService = require("./wallet.service")
const path = require("path")
const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const { codeGen, dateToJalali } = require("../../../common/function/function");
const { pagination, walletPagination } = require("../../../common/function/pagination");
class WalletController{
    #service
    constructor(){
        autoBind(this);
        this.#service = WalletService
    }
    
    async WalletForUser(req,res,next){
        try {
            const {userId} = req.user;
            const pageNumber = parseInt(req.query.page || 1); // Get the current page number from the query parameters
            const pageSize = parseInt(req.query.perpage || 10);
            const wallet = await this.#service.findWalletByUserIdForProfile(userId);
            const result = walletPagination(wallet.detail, pageNumber, pageSize);
            return res.status(200).json({
                statusCode: 200,
                data: {
                    shebaNum: wallet.shebaNum || "",
                    shebaName: wallet.shebaName || "",
                    result
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async EditShebaForUser(req,res,next){
        try {
            const {userId} = req.user;
            const {shebaNum , shebaName} = req.body
            const wallet = await this.#service.editWalletByUserIdForProfile(userId,shebaName,shebaNum);
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: "updated",
                    shebaNum: wallet.shebaNum,
                    shebaName: wallet.shebaName
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async WalletForPharmceyUser(req,res,next){
        try {
            const {userId} = req.pharmacyuser
            const pageNumber = parseInt(req.query.page || 1); // Get the current page number from the query parameters
            const pageSize = parseInt(req.query.perpage || 10);
            const wallet = await this.#service.findWalletByUserIdForProfile(userId)
            const result = walletPagination(wallet.detail, pageNumber, pageSize);
            return res.status(200).json({
                statusCode: 200,
                data: {
                    shebaNum: wallet.shebaNum || "",
                    shebaName: wallet.shebaName || "",
                    result
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async EditShebaForPharmceyUser(req,res,next){
        try {
            const {userId} = req.pharmacyuser
            const {shebaNum , shebaName} = req.body
            const wallet = await this.#service.editWalletByUserIdForProfile(userId,shebaName,shebaNum);
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: "updated",
                    shebaNum: wallet.shebaNum,
                    shebaName: wallet.shebaName
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async addDetail(req,res,next){
        try {
            const {userId} = req.pharmacyuser
            const pharmDetail = {
                RefNo: codeGen(),
                amount: 250000,
                paymentId: "66aa402cf1f0ebcf76be13af",
                invoiceId: "66aa402cf1f0ebcf76be13af",
                state: 'DECREMENT',
                status: true,
                description: `واریز مبلغ سفارش به شماره فاکتور 437496943745536 `
            }
            const pay = await this.#service.addWalletDetail(userId,pharmDetail)
            return res.status(200).json({
                statusCode: 200,
                data: {
                   pay
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    

}

module.exports = new WalletController();