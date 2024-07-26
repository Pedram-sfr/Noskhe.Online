const autoBind = require("auto-bind");
const UserModel = require("./user.model");
const createHttpError = require("http-errors");
const { UserMessages } = require("./user.messages");
const FactorModel = require("../../../Pharmacy/modules/factor/factor.model");
const { Types } = require("mongoose");
const { dateToJalali } = require("../../../common/function/function");

class UserService{
    #model;
    #factorModel;
    constructor(){
        autoBind(this);
        this.#model = UserModel;
        this.#factorModel = FactorModel;
    }
    
    async findUser(userId){
        // const user = await this.#model.findOne({mobile},{_id: 0,otp: 0,verfiedMobile:0,createdAt: 0,updatedAt:0,});
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
                    _id: 0,otp: 0,verfiedMobile:0,createdAt: 0,updatedAt:0,wallet: 0
                }
            }
        ])
        if(!user) throw createHttpError.NotFound(UserMessages.NotFound)
        return user
    } 
    async invoiceListForUser(userId,pageNumber,pageSize){
        const [{ total, data }] = await this.#factorModel.aggregate([
            {
              $match: { userId: new Types.ObjectId(userId),status: "DELIVERED" },
            },
            {
              $facet: {
                total: [{ $group: { _id: null, count: { $sum: 1 } } }],
                data: [{ $skip: (pageNumber - 1) * pageSize }, { $limit: pageSize },{$project: {
                    pharmacyId: 0,
                    updatedAt: 0,
                    userId: 0,
                    addressId: 0,
                    drugs: 0
                }},{$sort: {
                  _id: -1
                }}],
              },
            },
            {
              $project: {
                total: "$total.count",
                data: "$data",
              },
            },
          ]);
          if (!data) throw createHttpError.NotFound();
          return { total, data };
    } 
    async invoiceForUser(id,userId){
        const list = await this.#factorModel.aggregate([
            {$match: {_id: new Types.ObjectId(id), userId: new Types.ObjectId(userId)}},
            {$lookup: {
                from: "addresses",
                foreignField: "_id",
                localField: "addressId",
                as: "address"
            }},
            {
                $unwind: {
                    path: "$address",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    addressPostal: "$address.address",
                }
            },
            {
                $project:{
                    address: 0 ,
                    orderId: 0,
                    pharmacyId: 0,
                    updatedAt: 0,
                    userId: 0,
                    addressId: 0,
                    "drugs._id": 0
                }
            }]
        )
        if(!list) throw createHttpError.NotFound("یافت نشد")
        return list
    } 
    async updateUser(mobile,data){
        const updateuserResualt = await UserModel.updateOne({mobile},{
            $set: data
        })
        return updateuserResualt
    } 
    

}


module.exports = new UserService();
