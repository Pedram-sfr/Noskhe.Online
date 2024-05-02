const { model, default: mongoose } = require("mongoose");
const UserService = require("./user.service")
const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
class UserController{
    #service
    constructor(){
        autoBind(this);
        this.#service = UserService
    }
    async profile(req,res,next){
        try {
            const {mobile} = req.user
            const user = await this.#service.findUser(mobile)
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
            const {mobile} = req.user
            const data = req.body;
            const user = await this.#service.findUser(mobile)
            const updateuserResualt = await this.#service.updateUser(mobile,data)
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

module.exports = new UserController();