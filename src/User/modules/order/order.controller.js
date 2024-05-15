const OrderService = require("./order.service");
const path = require("path");
const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const UserModel = require("../user/user.model");
const {
  deleteFileInPublic,
  isFalse,
} = require("../../../common/function/function");
const { log } = require("console");
const OrderModel = require("./order.model");
const PharmacyOrderModel = require("./pharmacyOrder.model");
const AddressModel = require("../address/address.model");
const { Types } = require("mongoose");
const { pagination } = require("../../../common/function/pagination");
class OrderController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = OrderService;
  }
  async OrderList(req, res, next) {
    try {
      const { userId } = req.user;
      const pageNumber = parseInt(req.query.page || 1);
      const pageSize = parseInt(req.query.perpage || 10);
      const order = await OrderModel.find({ userId }, { updatedAt: 0 ,otc: 0,uploadPrescription: 0,elecPrescription: 0,pharmId: 0,addressId: 0,mobile: 0,fullName: 0},{sort: {_id: -1}}).lean();
      if (!order) throw createHttpError.NotFound("بافت نشد");
      const result = pagination(order, pageNumber, pageSize);
      return res.status(200).json({
        statusCode: 200,
        result,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async OrderWithOrderId(req, res, next) {
    try {
      const { userId } = req.user;
      const { orderId } = req.params;
      const order = await OrderModel.findOne({ _id: orderId, userId });
      if (!order) throw createHttpError.NotFound("بافت نشد");
      return res.status(200).json({
        statusCode: 200,
        data: {
          order,
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async createOrder(req, res, next) {
    try {
      const { userId } = req.user;
      const { description, addressId } = req.body;
      let resualt;
      const user = await UserModel.findById({ _id: userId });
      if (!user) throw createHttpError.NotFound("کاربر یافت نشد");
      const address = await AddressModel.findOne({ _id: addressId, userId });
      if (!address) throw createHttpError.NotFound("آدرس یافت نشد");
      resualt = await this.#service.createOrder({
        userId,
        mobile: user.mobile,
        description,
        addressId,
        fullName: user.fullName,
      });
      await this.#service.addOrderToPharmacy(address.coordinate, resualt._id);
      return res.status(200).json({
        statusCode: 200,
        data: {
          orderId: resualt._id,
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async addOTC(req, res, next) {
    try {
      const ordOTC = req.body;
      const { userId } = req.user;
      if (ordOTC.fileUploadPath && ordOTC.filename) {
        console.log("1");
        req.body.image = path
          .join(ordOTC.fileUploadPath, ordOTC.filename)
          .replace(/\\/gi, "/");
        const { orderId, count } = ordOTC;
        const image = req.body.image;
        await this.#service.addOTCImage(orderId, userId, image, count);
      } else {
        const { orderId, count, type, drugName } = ordOTC;
        await this.#service.addOTC(orderId, userId, type, count, drugName);
      }

      return res.status(200).json({
        statusCode: 200,
        data: {
          message: "SUCCESS",
        },
        error: null,
      });
    } catch (error) {
      deleteFileInPublic(req.body?.image);
      next(error);
    }
  }
  async addUploadPrescription(req, res, next) {
    try {
      const ordup = req.body;
      const { userId } = req.user;
      req.body.image = path
        .join(ordup.fileUploadPath, ordup.filename)
        .replace(/\\/gi, "/");
      const { orderId } = ordup;
      const data = {};
      const image = req.body.image;
      data.image = image;
      await this.#service.addUploadPrescription(orderId, userId, data);
      return res.status(200).json({
        statusCode: 200,
        data: {
          message: "افزوده شد",
        },
        error: null,
      });
    } catch (error) {
      deleteFileInPublic(req.body.image);
      next(error);
    }
  }
  async addElecPrescription(req, res, next) {
    try {
      const { orderId, trackingCode,doctorName,nationalCode,typeOfInsurance } = req.body;
      const { userId } = req.user;
      await this.#service.addElecPrescription(
        orderId,
        userId,
        trackingCode,doctorName,nationalCode,typeOfInsurance
      );
      return res.status(200).json({
        statusCode: 200,
        data: {
          message: "افزوده شد",
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async notAcceptOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req.pharmacyuser;
      console.log(id);
      const otpd = await PharmacyOrderModel.findOne({
        _id: id,
        pharmacyId: userId,
      });
      if (!otpd) throw createHttpError.NotFound("سفارش یافت نشد");
      await this.#service.notAcceptOrderToPharmacy(id);
      return res.status(200).json({
        statusCode: 200,
        data: {
          message: "OK",
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
