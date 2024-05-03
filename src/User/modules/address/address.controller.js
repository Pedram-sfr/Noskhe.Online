const AddressService = require("./address.service")
const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const { getAddressDetail } = require("../../../common/utils/http");
const AddressModel = require("./address.model");
const { AddressMessages } = require("./address.messages");
const UserModel = require("../user/user.model");
const { isFalse } = require("../../../common/function/function");
const { Types, default: mongoose } = require("mongoose");
class AddressController{
    #service
    constructor(){
        autoBind(this);
        this.#service = AddressService
    }
    async createAddress(req,res,next){
        try {
            const {lat,lng,fullName,phone,myself} = req.body
            const {mobile,userId} = req.user
            const { address, province, city } = await getAddressDetail(lat,lng);
            if(isFalse(myself)){
                const data = {
                    coordinate: [lat, lng],fullName,mobile: phone,userId,address, province, city
                }
                await AddressModel.create(data)
                return res.status(200).json({
                    statusCode: 200,
                    data: {
                        message: AddressMessages.createAddress
                    },
                    error: null
                })
            }
            const user = await UserModel.findById(userId)
            const data = {
                coordinate: [lat, lng],fullName: user.fullName,mobile,userId,address, province, city
            }
            await AddressModel.create(data)
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: AddressMessages.createAddress
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async editAddress(req,res,next){
        try {
            const {addressId,lat,lng,fullName,phone,myself} = req.body
            const {mobile,userId} = req.user;
            let data;
            let nullishData = [""," ","0",0,null,undefined];
            if(isFalse(myself)){
                console.log("3");
                if(nullishData.includes(lat) && nullishData.includes(lng)){
                    data = {
                        fullName,mobile: phone
                    }
                }
                else{
                    const { address, province, city } = await getAddressDetail(lat,lng);
                    data = {
                        coordinate: [lat, lng],fullName,mobile: phone,address, province, city
                    }
                }
                await this.#service.updateAddressInDB(addressId,data)
            }
            else{
                console.log(userId);
                const user = await UserModel.findById(userId)
                if(nullishData.includes(lat) && nullishData.includes(lng)){
                    data = {
                        fullName: user.fullName,mobile
                    }
                }
                else{
                    const { address, province, city } = await getAddressDetail(lat,lng);
                    data = {
                        coordinate: [lat, lng],fullName: user.fullName,mobile,address, province, city
                    }
                }
                await this.#service.updateAddressInDB(addressId,data)
            }
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: AddressMessages.updateAddress
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async removeAddress(req,res,next){
        try {
            const {addressId} = req.params;
            const {userId} = req.user;
            const address = await this.#service.findAddressById(addressId);
            if(!address) throw createHttpError.NotFound(AddressMessages.NotFoundAddress);
            console.log(address,address._id);
            const remove = await AddressModel.deleteOne({_id: address._id, userId});
            if(!remove.deletedCount) throw createHttpError.InternalServerError("خطای سرور");
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: AddressMessages.removeAddress
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async addressList(req,res,next){
        try {
            const {userId} = req.user;
            const address = await this.#service.findAddressByUserId(userId);
            if(!address) throw createHttpError.NotFound(AddressMessages.NotFoundAddress);
            return res.status(200).json({
                statusCode: 200,
                data: {
                    userId,
                    address
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }

    
}

module.exports = new AddressController();