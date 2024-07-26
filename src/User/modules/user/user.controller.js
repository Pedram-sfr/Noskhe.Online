const { model, default: mongoose } = require("mongoose");
const UserService = require("./user.service")
const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const { pagination } = require("../../../common/function/pagination");
class UserController{
    #service
    constructor(){
        autoBind(this);
        this.#service = UserService
    }
    async profile(req,res,next){
        try {
            const {userId} = req.user
            const user = await this.#service.findUser(userId)
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
    async invoiceList(req,res,next){
        try {
            const {userId} = req.user
            const pageNumber = parseInt(req.query.page || 1);
            const pageSize = parseInt(req.query.perpage || 10);
            const list = await this.#service.invoiceListForUser(userId,pageNumber,pageSize)
            const result = pagination(list.data, pageNumber, pageSize,list.total[0]);
            return res.status(200).json({
                statusCode: 200,
                result,
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async invoice(req,res,next){
        try {
            const {userId} = req.user
            const {id} = req.params
            const invoice = await this.#service.invoiceForUser(id,userId)
            return res.status(200).json({
                statusCode: 200,
                invoice,
                error: null
            })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new UserController();