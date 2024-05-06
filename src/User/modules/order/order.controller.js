const OrderService = require("./order.service")
const path = require("path")
const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const UserModel = require("../user/user.model");
const { deleteFileInPublic, isFalse } = require("../../../common/function/function");
const { log } = require("console");
const OrderModel = require("./order.model");
const PharmacyOrderModel = require("./pharmacyOrder.model");
class OrderController{
    #service
    constructor(){
        autoBind(this);
        this.#service = OrderService
    }
    async OrderList(req,res,next){
        try {
            const {userId} = req.user;
            const {orderId} = req.params;
            const order = await OrderModel.findOne({_id: orderId,userId})
            if(!order) throw createHttpError.NotFound("بافت نشد")
            return res.status(200).json({
                statusCode: 200,
                data: {
                    order
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async createOrder(req,res,next){
        try {
            const {userId} = req.user;
            const {description, addressId,mobile,fullName,myself} = req.body;
            let resualt;
            if(isFalse(myself)){
                resualt=await this.#service.createOrder({userId,mobile,description, addressId,status: 0,fullName})
            }else{
                const user = await UserModel.findById({_id: userId});
                if(!user) throw createHttpError.NotFound("کاربر یافت نشد")
                resualt=await this.#service.createOrder({userId,mobile:user.mobile,description, addressId,status: 0,fullName:user.fullName})
            }
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
    async editOTC(req,res,next){
        try {
            const {otcId,orderId} = req.body;
            const {userId} = req.user;
            const {filename,fileUploadPath} = req.body
            const data = OrderModel.findOne({"otc._id": otcId})
            if(req.file){
                deleteFileInPublic(course.image)
                data.image = path.join(fileUploadPath,filename).replace(/\\/g,"/");
            }
            req.body.image = (path.join(ordOTC.fileUploadPath,ordOTC.filename)).replace(/\\/gi,"/");
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
    async addOrderToPharmacy(req,res,next){
        try {
            const {orderId,pharmacyId} = req.body;
            const resualt = await PharmacyOrderModel.create({orderId,pharmacyId});
            if(!resualt) throw createHttpError.InternalServerError("خطای سرور")
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