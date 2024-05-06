const autoBind = require("auto-bind");
const PharmacyUserModel = require("./pharmacyUser.model");
const createHttpError = require("http-errors");
const { UserMessages } = require("./pharmacyUser.messages");

class PharmacyUserService{
    #model;
    constructor(){
        autoBind(this);
        this.#model = PharmacyUserModel
    }
    
    async findPharmacyUser(userName){
        const user = await this.#model.findOne({userName},{_id: 0,otp: 0,verfiedMobile:0,createdAt: 0,updatedAt:0,});
        if(!user) throw createHttpError.NotFound(UserMessages.NotFound)
        return user
    } 
    async updatePharmacyUser(userName,data){
        const updateuserResualt = await this.#model.updateOne({userName},{
            $set: data
        })
        return updateuserResualt
    } 

}


module.exports = new PharmacyUserService();
