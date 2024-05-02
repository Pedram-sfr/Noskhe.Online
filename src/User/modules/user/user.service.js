const autoBind = require("auto-bind");
const UserModel = require("./user.model");
const createHttpError = require("http-errors");
const { UserMessages } = require("./user.messages");

class UserService{
    #model;
    constructor(){
        autoBind(this);
        this.#model = UserModel
    }
    
    async findUser(mobile){
        const user = await this.#model.findOne({mobile},{_id: 0,otp: 0,verfiedMobile:0,createdAt: 0,updatedAt:0,});
        if(!user) throw createHttpError.NotFound(UserMessages.NotFound)
        return user
    } 
    async updateUser(mobile,data){
        const updateuserResualt = await UserModel.updateOne({mobile},{
            $set: data
        })
        return updateuserResualt
    } 

}


module.exports = new UserService();
