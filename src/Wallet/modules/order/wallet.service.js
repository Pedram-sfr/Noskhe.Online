const autoBind = require("auto-bind");
const WalletModel = require("./wallet.model");
const createHttpError = require("http-errors");
const { dateToJalali, isFalse } = require("../../../common/function/function");

class WalletService{
    #model;
    constructor(){
        autoBind(this);
        this.#model = WalletModel
    }
    async createWallet(userId){
        const wallet = await this.#model.create({userId})
        if(!wallet) return false
        return true
    } 
    async findWalletByUserId(userId){
        const wallet = await this.#model.findOne({userId})
        if(!wallet) return false
        return true
    } 
    async findWalletByUserIdForProfile(userId){
        const wallet = await this.#model.findOne({userId},{_id: 0,updatedAt: 0,createdAt: 0,"detail.updatedAt": 0,"detail._id": 0}).lean()
        if(!wallet) throw createHttpError.NotFound("یافت نشد")
        for (let i = 0; i < wallet?.detail.length; i++) {
            const {date, time} = dateToJalali(wallet.detail[i]["createdAt"])
            wallet.detail[i].createdAt = {date,time}
        }
        return wallet
    } 
    async addWalletDetail(userId,data){
        console.log(data);
        const wallet = await this.findWalletByUserIdForProfile(userId);
        let cash = 0;
        if(isFalse(data.status))
             cash = wallet.cash - data?.amount;
        else
             cash = wallet.cash + data?.amount
        const res = await this.#model.updateOne({userId},{
            cash,
            $push:{
                detail: data
            }
        });
        if(res.modifiedCount == 0) throw createHttpError.InternalServerError(data)
        return res
    }
    
}


module.exports = new WalletService();
