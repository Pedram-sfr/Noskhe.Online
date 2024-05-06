const { model, default: mongoose } = require("mongoose");
const PharmacyUserService = require("./pharmacyUser.service")
const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const { deleteNulishObject } = require("../../../common/function/function");
class PharmacyUserController{
    #service
    constructor(){
        autoBind(this);
        this.#service = PharmacyUserService
    }
    async profile(req,res,next){
        try {
            const {userName} = req.pharmacyuser
            const user = await this.#service.findPharmacyUser(userName)
            return res.status(200).json({
                statusCode: 200,
                data: {
                    user
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async editProfile(req,res,next){
        try {
            const {userName} = req.pharmacyuser
            const data = req.body;
            await this.#service.findPharmacyUser(userName)
            deleteNulishObject(data)
            const updateuserResualt = await this.#service.updatePharmacyUser(userName,data)
            if(!updateuserResualt.modifiedCount) throw createHttpError.InternalServerError("به روزرسانی انجام نشد")
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: "بروزرسانی با موفقیت انجام شد"
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new PharmacyUserController();