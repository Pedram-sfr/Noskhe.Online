const WalletService = require("./wallet.service")
const path = require("path")
const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const { codeGen, dateToJalali } = require("../../../common/function/function");
class WalletController{
    #service
    constructor(){
        autoBind(this);
        this.#service = WalletService
    }
    
    async WalletForUser(req,res,next){
        try {
            const {userId} = req.user;
            const {detail} = await this.#service.findWalletByUserIdForProfile(userId)
            
            return res.status(200).json({
                statusCode: 200,
                data: {
                    detail
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
            const {detail} = await this.#service.findWalletByUserIdForProfile(userId)
            return res.status(200).json({
                statusCode: 200,
                data: {
                    detail
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    

}

module.exports = new WalletController();