const OrderService = require("./order.service")
const path = require("path")
const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const UserModel = require("../user/user.model");
const { deleteFileInPublic } = require("../../../common/function/function");
const { log } = require("console");
class OrderController{
    #service
    constructor(){
        autoBind(this);
        this.#service = OrderService
    }
    async createOrder(req,res,next){
        try {
            const {mobile,userId} = req.user;
            const {description, addressId} = req.body;
            const resualt = await this.#service.createOrder({userId,mobile,description, addressId,status: "در انتظار تایید داروخانه"})
            return res.status(200).json({
                statusCode: 200,
                data: {
                    orderId: resualt._id
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async addOTC(req,res,next){
        try {
            const ordOTC = req.body;
            const {userId} = req.user;
            req.body.image = (path.join(ordOTC.fileUploadPath,ordOTC.filename)).replace(/\\/gi,"/");
            const {orderId,data} = ordOTC
            const image = req.body.image;
            const dataobj = JSON.parse(data)
            dataobj.image = image
            await this.#service.addOTC(orderId,userId,dataobj)
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: "افزوده شد"
                },
                error: null
            })
        } catch (error) {
            deleteFileInPublic(req.body.image)
            next(error)
        }
    }
    async addUploadPrescription(req,res,next){
        try {
            const ordup = req.body;
            const {userId} = req.user;
            req.body.image = (path.join(ordup.fileUploadPath,ordup.filename)).replace(/\\/gi,"/");
            const {orderId} = ordup
            const data={};
            const image = req.body.image;
            data.image = image
            await this.#service.addUploadPrescription(orderId,userId,data)
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: "افزوده شد"
                },
                error: null
            })
        } catch (error) {
            deleteFileInPublic(req.body.image)
            next(error)
        }
    }
    async addElecPrescription(req,res,next){
        try {
            const {orderId,data} = req.body;
            const {userId} = req.user;
            await this.#service.addElecPrescription(orderId,userId,JSON.parse(data))
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: "افزوده شد"
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }


}

module.exports = new OrderController();