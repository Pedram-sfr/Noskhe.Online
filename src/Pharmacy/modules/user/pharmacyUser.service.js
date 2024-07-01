const autoBind = require("auto-bind");
const PharmacyUserModel = require("./pharmacyUser.model");
const createHttpError = require("http-errors");
const { UserMessages } = require("./pharmacyUser.messages");
const { Types } = require("mongoose");
const PharmacyOrderModel = require("../../../User/modules/order/pharmacyOrder.model");
const FactorModel = require("../factor/factor.model");

class PharmacyUserService{
    #model;
    #uomodel;
    #fmodel
    constructor(){
        autoBind(this);
        this.#model = PharmacyUserModel
        this.#uomodel = PharmacyOrderModel;
        this.#fmodel = FactorModel
    }
    
    async findPharmacyUser(userId){
        // const user = await this.#model.findOne({userName},{_id: 0,otp: 0,verfiedMobile:0,createdAt: 0,updatedAt:0,});
        const user = await this.#model.aggregate([
            {$match: {_id: new Types.ObjectId(userId)}},
            {$lookup: {
                from: "wallets",
                foreignField: "userId",
                localField: "_id",
                as: "wallet"
            }},
            {
                $unwind: {
                    path: "$wallet",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    walletBalance: "$wallet.cash",
                }
            },{
                $project:{
                    _id: 0,otp: 0,verfiedMobile:0,createdAt: 0,updatedAt:0,wallet: 0,password:0
                }
            }
        ])
        if(!user) throw createHttpError.NotFound(UserMessages.NotFound)
        return user
    } 
    async updatePharmacyUser(userName,data){
        const updateuserResualt = await this.#model.updateOne({userName},{
            $set: data
        })
        return updateuserResualt
    } 
    async countOfUnconfirmedOrders(pharmacyId){
        const uorder = await this.#uomodel.find({pharmacyId},{_id:1});
        return uorder.length;
    }
    async countOfConfirmedOrders(pharmacyId){
        const cOrder = await this.#fmodel.find({pharmacyId,status: "PENDING"},{_id:1});
        return cOrder.length;
    }
    async countOfCurrentCourierOrders(pharmacyId){
        const cOrder = await this.#fmodel.find({pharmacyId,status: "PAID",deliveryType: "COURIER"},{_id:1});
        return cOrder.length;
    }
    async countOfCurrentPersonOrders(pharmacyId){
        const cOrder = await this.#fmodel.find({pharmacyId,status: "PAID",deliveryType: "PERSON"},{_id:1});
        return cOrder.length;
    }
    async countOfWFCOrders(pharmacyId){
        const cOrder = await this.#fmodel.find({pharmacyId,status: "WFC",deliveryType: "COURIER"},{_id:1});
        return cOrder.length;
    }
    async countOfOrders(pharmacyId){
        const cOrder = await this.#fmodel.find({pharmacyId},{_id:1});
        return cOrder.length;
    }
}


module.exports = new PharmacyUserService();
