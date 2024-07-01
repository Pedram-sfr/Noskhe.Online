const OrderService = require("./order.service");
const path = require("path");
const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const UserModel = require("../user/user.model");
const {
  deleteFileInPublic,
  isFalse,
  deleteFileInPublicAWS,
  codeGen,
} = require("../../../common/function/function");
const { log } = require("console");
const OrderModel = require("./order.model");
const PharmacyOrderModel = require("./pharmacyOrder.model");
const AddressModel = require("../address/address.model");
const { Types } = require("mongoose");
const { pagination } = require("../../../common/function/pagination");
const FactorModel = require("../../../Pharmacy/modules/factor/factor.model");
const PharmacyUserModel = require("../../../Pharmacy/modules/user/pharmacyUser.model");
const PaymentModel = require("../../../Payment/modules/user/payment.model");
class OrderController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = OrderService;
  }
  async pharmacyList(req, res, next) {
    try {
      const { userId } = req.user;
      const { addressId } = req.body;
      console.log(userId, addressId);
      const address = await AddressModel.findOne({ _id: addressId, userId });
      if (!address) throw createHttpError.NotFound("آدرس یافت نشد");
      const result = await this.#service.findPharmacyAroundUser(
        address.coordinate
      );
      return res.status(200).json({
        statusCode: 200,
        result,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async createPersonOrder(req, res, next) {
    try {
      const { userId } = req.user;
      const { description, addressId, pharmacyId } = req.body;
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
        deliveryType: "PERSON",
      });
      await this.#service.addOrderToPerson(pharmacyId, resualt._id);
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
  async invoice(req, res, next) {
    try {
      const { userId } = req.user;
      const { orderId } = req.params;
      const delivery = {};
      const invoice = {};
      const order = await OrderModel.findOne(
        { userId, _id: orderId },
        { deliveryType: 1, status: 1, addressId: 1 }
      ).lean();
      if (!order) throw createHttpError.NotFound("بافت نشد");
      if (order.status == "PENDING" || order.status == "FAILED")
        throw createHttpError.NotFound("بافت نشد");
      const factor = await FactorModel.findOne(
        { userId, orderId },
        { orderId: 0, _id: 0, userId: 0, updatedAt: 0 }
      );
      const now = new Date().getTime();
      if (factor.status == "PENDING") {
        if (factor.deliveryType == "PERSON") {
          const address = await PharmacyUserModel.findById(factor.pharmacyId, {
            address: 1,
          });
          delivery.deliverTime = new Date(now + factor.deliveryTime * 60000);
          delivery.deleverTo = address.address;
          delivery.deleveryType = factor.deliveryType;
        } else if (factor.deliveryType == "COURIER") {
          const del = await AddressModel.findById(factor.addressId, {
            address: 1,
          });
          delivery["deliverTime"] = new Date(now + 60 * 60000);
          delivery["deleverTo"] = del.address;
          delivery.deleveryType = factor.deliveryType;
        }
        invoice.delivery = delivery;
        invoice.payment = {};
      } else if (factor.status == "PAID") {
        const payment = {};
        const pay = await PaymentModel.findOne({ _id: factor.paymentCode });
        payment.trackingCode = pay.trackingCode;
        payment.amount = pay.amount;
        payment.createdAt = pay.createdAt;
        delivery.deliveryTo = pay.deliveryTo;
        delivery.deliveryType = pay.deliveryType;
        delivery.deliveryTime = pay.deliveryTime;
        delivery.deliveryDate = pay.deliveryDate;
        delivery.deliveryCode = pay.deliveryCode;
        invoice.payment = payment;
        invoice.delivery = delivery;
      }
      const d = await FactorModel.findOne(
        { userId, orderId },
        {
          orderId: 0,
          _id: 0,
          userId: 0,
          updatedAt: 0,
          addressId: 0,
          pharmacyId: 0,
          deliveryTime: 0,
          deliveryType: 0,
          paymentStatus: 0,
          sendStatus: 0,
          active: 0,
          paymentCode: 0,
        }
      );

      invoice.detail = d;
      return res.status(200).json({
        statusCode: 200,
        invoice,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async OrderList(req, res, next) {
    try {
      const { userId } = req.user;
      const search = req.query.search;
      const pageNumber = parseInt(req.query.page || 1);
      const pageSize = parseInt(req.query.perpage || 10);
      let order;
      if (search) {
        order = await OrderModel.find(
          { userId, refId: search },
          {
            updatedAt: 0,
            otc: 0,
            uploadPrescription: 0,
            elecPrescription: 0,
            pharmId: 0,
            addressId: 0,
            mobile: 0,
            fullName: 0,
          },
          { sort: { _id: -1 } }
        ).lean();
      } else {
        order = await OrderModel.find(
          { userId },
          {
            updatedAt: 0,
            otc: 0,
            uploadPrescription: 0,
            elecPrescription: 0,
            pharmId: 0,
            addressId: 0,
            mobile: 0,
            fullName: 0,
          },
          { sort: { _id: -1 } }
        ).lean();
      }
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
      let address;
      if (order.deliveryType == "COURIER") {
        address = await AddressModel.findById(order.addressId);
      } else if (order.deliveryType == "PERSON") {
        const { address } = await PharmacyUserModel.findById(order.pharmId, {
          address: 1,
        });
        order["address"] = address;
      }
      return res.status(200).json({
        statusCode: 200,
        data: {
          order,
          address,
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
        refId: codeGen(),
        userId,
        mobile: user.mobile,
        description,
        addressId,
        fullName: user.fullName,
      });
      await this.#service.addOrderToPharmacy(address.coordinate, resualt._id,resualt.refId);
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
      if (ordOTC?.fileUploadPath) {
        req.body.image = path
          .join(ordOTC.fileUploadPath, ordOTC.filename)
          .replace(/\\/gi, "/");
        const { orderId, count, type } = ordOTC;
        const image = req.body.image;
        await this.#service.addOTCImage(orderId, userId, image, count, type);
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
      await deleteFileInPublic(req.body.image);
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
      const datao = {};
      const image = req.body.image;
      datao.image = image;
      await this.#service.addUploadPrescription(orderId, userId, datao);
      return res.status(200).json({
        statusCode: 200,
        data: {
          message: "افزوده شد",
        },
        error: null,
      });
    } catch (error) {
      await deleteFileInPublic(req.body.image);
      next(error);
    }
  }
  async addElecPrescription(req, res, next) {
    try {
      const {
        orderId,
        trackingCode,
        doctorName,
        nationalCode,
        typeOfInsurance,
      } = req.body;
      const { userId } = req.user;
      await this.#service.addElecPrescription(
        orderId,
        userId,
        trackingCode,
        doctorName,
        nationalCode,
        typeOfInsurance
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
  async checkPharmAroundUser(req, res, next) {
    try {
      const { addressId } = req.params;
      const cor = await AddressModel.findOne(
        { _id: addressId },
        { coordinate: 1, _id: 0 }
      );
      if (!cor) throw createHttpError.BadRequest();
      const data = await OrderService.calDistanceCordinate(cor.coordinate);
      if (data.length == 0) throw createHttpError.NotFound(false);
      return res.status(200).json({
        statusCode: 200,
        data: {
          message: true,
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
