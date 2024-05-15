const autoBind = require("auto-bind");
const FactorModel = require("./factor.model");
const createHttpError = require("http-errors");
const OrderModel = require("../../../User/modules/order/order.model");
const { Types } = require("mongoose");
const {
  isTrue,
  codeGen,
  dateToJalali,
  isFalse,
} = require("../../../common/function/function");
const {
  addWalletDetail,
} = require("../../../Wallet/modules/order/wallet.service");
const PharmacyOrderModel = require("../../../User/modules/order/pharmacyOrder.model");

class FactorService {
  #model;
  #orderModel;
  constructor() {
    autoBind(this);
    this.#model = FactorModel;
    this.#orderModel = OrderModel;
  }

  async orderListForPharmacy(pharmId) {
    const order = await this.#orderModel
      .find(
        { pharmId },
        {
          accepted: 0,
          uploadPrescription: 0,
          otc: 0,
          pharmId: 0,
          elecPrescription: 0,
          userId: 0,
          addressId: 0,
          status: 0,
          updatedAt: 0,
        },
        {sort:{
          _id: -1
        }}
      )
      .lean();
    if (!order) throw createHttpError.NotFound("لیست سفارشات خالی است");
    return order;
  }
  async orderForPharmacy(pharmId, orderId) {
    const order = await this.#orderModel
      .findOne(
        { _id: orderId, pharmId },
        { updatedAt: 0, status: 0, pharmId: 0, mobile: 0, fullName: 0 },
        {sort: {
          _id: -1
        }}
      )
      .lean();
    if (!order && isFalse(order.accepted))
      throw createHttpError.NotFound("لیست سفارشات خالی است");
    const { date, time } = dateToJalali(order.createdAt);
    order["createdAt"] = { date, time };
    return order;
  }
  async createFactor(data) {
    const res = await this.#model.create(data);
    if (!res) throw createHttpError.InternalServerError("خطای سرور");
    return res;
  }
  async deleteDrugInFactor(pharmacyId, invoiceId, drugId) {
    const factor = await this.#model.findOne({
      invoiceId,
      pharmacyId,
      "drugs._id": drugId,
    });
    if (!factor) throw createHttpError.NotFound("یافت نشد");
    let total = 0;
    for (let i = 0; i < factor.drugs.length; i++) {
      if (factor.drugs[i]._id.equals(new Types.ObjectId(drugId)))
        total = factor.drugs[i].total;
    }
    const remove = await this.#model.updateOne(
      {
        invoiceId: invoiceId,
      },
      {
        $pull: {
          drugs: {
            _id: drugId,
          },
        },
      }
    );
    console.log(total);
    return total;
  }
  async findFactor(invoiceId) {
    const factor = this.#model.findOne({ invoiceId });
    if (!factor) throw createHttpError.NotFound("یافت نشد");
    return factor;
  }
  async findFactorForPrint(invoiceId) {
    const fc = await this.#model.findOne({ invoiceId });
    if (!fc) throw createHttpError.NotFound("یافت نشد");
    const factor = await this.#model.aggregate([
      { $match: { _id: fc?._id } },
      {
        $lookup: {
          from: "pharmacyusers",
          foreignField: "_id",
          localField: "pharmacyId",
          as: "pharmacy",
        },
      },
      {
        $lookup: {
          from: "orders",
          foreignField: "_id",
          localField: "orderId",
          as: "order",
        },
      },
      {
        $unwind: {
          path: "$pharmacy",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$order",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          pharmacyName: "$pharmacy.pharmacyName",
          elecPrescription: "$order.elecPrescription",
        },
      },
      {
        $project: {
          pharmacy: 0,
          shippingCost: 0,
          sendStatus: 0,
          order: 0,
          orderId: 0,
          pharmacyId: 0,
          updatedAt: 0,
          userId: 0,
          addressId: 0,
        },
      },
    ]);
    return factor;
  }
  async findNewOrder(pharmacyId) {
    const data = await PharmacyOrderModel.find(
      { pharmacyId },
      { priority: 0, updatedAt: 0 }
    ).lean();
    if (!data) throw createHttpError.BadRequest();
    for (let i = 0; i < data.length; i++) {
      const { date, time } = dateToJalali(data[i].createdAt);
      data[i]["createdAt"] = { date, time };
    }
    return data;
  }
}

module.exports = new FactorService();
