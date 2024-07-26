const autoBind = require("auto-bind");
const AddressModel = require("./address.model");
const createHttpError = require("http-errors");
const { AddressMessages } = require("./address.messages");

class AddressService{
    #model;
    constructor(){
        autoBind(this);
        this.#model = AddressModel
    } 
    async createAddressInDB(data){
        return await this.#model.create(data);
    }
    async updateAddressInDB(_id,data){
        let nullishData = [""," ","0",0,null,undefined];
        Object.keys(data).forEach(key => {
            if(Array.isArray(data[key]) && data[key].length == 0) delete data[key]
            if(nullishData.includes(data[key])) delete data[key]
        })
        const res =  await this.#model.updateOne({_id},{$set: {...data}});
        if(res.modifiedCount == 0) throw new createHttpError.InternalServerError(AddressMessages.NotUpdateAddress)
        return res
    }

    async findAddressById(_id){
        return await this.#model.findById(_id)
    }
    async findAddressByUserId(userId){
        return await this.#model.find({userId},{updatedAt: 0,createdAt: 0,userId: 0},{sort: {_id: -1}});
        
    }
}


module.exports = new AddressService();
