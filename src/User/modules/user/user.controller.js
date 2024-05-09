const { model, default: mongoose } = require("mongoose");
const UserService = require("./user.service")
const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const { dateToJalali } = require("../../../common/function/function");
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
    async invoiceList(req,res,next){
        try {
            const {userId} = req.user
            const list = await this.#service.invoiceListForUser(userId)
            for (let i = 0; i < list.length; i++) {
                const {date,time} = dateToJalali(list[i].createdAt)
                list[i].date = date;
                list[i].time = time;
            }
            return res.status(200).json({
                statusCode: 200,
                data: {
                    list
                },
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
            for (let i = 0; i < invoice.length; i++) {
                const {date,time} = dateToJalali(invoice[i].createdAt)
                invoice[i].date = date;
                invoice[i].time = time;
            }
            return res.status(200).json({
                statusCode: 200,
                data: {
                    invoice
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new UserController();