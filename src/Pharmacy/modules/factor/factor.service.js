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

  async orderListForPharmacy(pharmacyId,pageNumber, pageSize) {
    // const order = await this.#model
    //   .find(
    //     { pharmacyId },
    //     {
    //       accepted: 0,
    //       uploadPrescription: 0,
    //       otc: 0,
    //       pharmacyId: 0,
    //       elecPrescription: 0,
    //       userId: 0,
    //       addressId: 0,
    //       updatedAt: 0,
    //     },
    //     {
    //       sort: {
    //         _id: -1,
    //       },
    //     }
    //   )
    //   .lean();
      const [{ total, data }] = await this.#model.aggregate([
        {
          $match: { pharmacyId: new Types.ObjectId(pharmacyId) },
        },
        {
          $facet: {
            total: [{ $group: { _id: null, count: { $sum: 1 } } }],
            data: [{ $skip: (pageNumber - 1) * pageSize }, { $limit: pageSize },{$project: {
              accepted: 0,
              uploadPrescription: 0,
              otc: 0,
              pharmacyId: 0,
              elecPrescription: 0,
              userId: 0,
              addressId: 0,
              updatedAt: 0,
            }},{$sort: {_id: -1}}],
          },
        },
        {
          $project: {
            total: "$total.count",
            data: "$data",
          },
        },
      ]);
      if (!data) throw createHttpError.BadRequest();
      return { total, data };
  }
  async orderForPharmacy(pharmacyId, orderId) {
    const order = await this.#model
      .findOne(
        { orderId, pharmacyId },
        { updatedAt: 0, pharmacyId: 0, mobile: 0, addressId: 0 },
        {
          sort: {
            _id: -1,
          },
        }
      )
      .lean();
    if (!order && isFalse(order.accepted))
      throw createHttpError.NotFound("لیست سفارشات خالی است");
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
  async findFactor(invoiceId, pharmacyId) {
    const factor = this.#model.findOne({
      invoiceId,
      pharmacyId,
      paymentStatus: true,
    });
    if (!factor) throw createHttpError.NotFound("یافت نشد");
    return factor;
  }
  async findFactorList(pharmacyId) {
    const factor = this.#model.find(
      { pharmacyId, paymentStatus: true },
      {
        invoiceId: 1,
        createdAt: 1,
        status: 1,
        active: 1,
        deliveryType: 1,
        paymentStatus: 1,
      }
    );
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
  async findNewOrder(pharmacyId,pageNumber, pageSize) {
    // const data = await PharmacyOrderModel.find(
    //   { pharmacyId },
    //   { priority: 0, updatedAt: 0 }
    // );
    const [{ total, data }] = await PharmacyOrderModel.aggregate([
      {
        $match: { pharmacyId: new Types.ObjectId(pharmacyId) },
      },
      {
        $facet: {
          total: [{ $group: { _id: null, count: { $sum: 1 } } }],
          data: [{ $skip: (pageNumber - 1) * pageSize }, { $limit: pageSize },{$project: {priority: 0, updatedAt: 0}}],
        },
      },
      {
        $project: {
          total: "$total.count",
          data: "$data",
        },
      },
    ]);
    if (!data) throw createHttpError.BadRequest();
    return { total, data };
  }
  async findNewOrderSingle(pharmacyId, orderId) {
    const pod = await PharmacyOrderModel.findOne(
      { pharmacyId, orderId },
      { priority: 0, updatedAt: 0 }
    ).lean();
    if (!pod) throw createHttpError.BadRequest();
    const data = await OrderModel.findOne(
      { _id: orderId },
      { addressId: 0, mobile: 0, userId: 0, updatedAt: 0 }
    ).lean();
    if (!data) throw createHttpError.NotFound();
    return data;
  }
  async findOrdersWithStatus(pharmacyId, status, deliveryType,pageNumber, pageSize) {
    // const order = await this.#model.find(
    //   { pharmacyId, status, deliveryType },
    //   {
    //     accepted: 0,
    //     uploadPrescription: 0,
    //     otc: 0,
    //     pharmacyId: 0,
    //     elecPrescription: 0,
    //     userId: 0,
    //     addressId: 0,
    //     updatedAt: 0,
    //   },
    //   {
    //     sort: {
    //       _id: -1,
    //     },
    //   }
    // );
    const [{ total, data }] = await this.#model.aggregate([
      {
        $match: { pharmacyId: new Types.ObjectId(pharmacyId),status, deliveryType },
      },
      {
        $facet: {
          total: [{ $group: { _id: null, count: { $sum: 1 } } }],
          data: [{ $skip: (pageNumber - 1) * pageSize }, { $limit: pageSize },{$project: {
            accepted: 0,
            uploadPrescription: 0,
            otc: 0,
            pharmacyId: 0,
            elecPrescription: 0,
            userId: 0,
            addressId: 0,
            updatedAt: 0,
          }},{$sort: {
            _id: -1
          }}],
        },
      },
      {
        $project: {
          total: "$total.count",
          data: "$data",
        },
      },
    ]);
    if (!data) throw createHttpError.BadRequest();
    return { total, data };
  }
  async findConfirmedOrders(pharmacyId, status,pageNumber, pageSize) {
    // const order = await this.#model.find(
    //   { pharmacyId, status },
    //   {
    //     accepted: 0,
    //     uploadPrescription: 0,
    //     otc: 0,
    //     pharmacyId: 0,
    //     elecPrescription: 0,
    //     userId: 0,
    //     addressId: 0,
    //     updatedAt: 0,
    //   },
    //   {
    //     sort: {
    //       _id: -1,
    //     },
    //   }
    // );
    const [{ total, data }] = await this.#model.aggregate([
      {
        $match: { pharmacyId: new Types.ObjectId(pharmacyId),status },
      },
      {
        $facet: {
          total: [{ $group: { _id: null, count: { $sum: 1 } } }],
          data: [{ $skip: (pageNumber - 1) * pageSize }, { $limit: pageSize },{$project: {
            accepted: 0,
            uploadPrescription: 0,
            otc: 0,
            pharmacyId: 0,
            elecPrescription: 0,
            userId: 0,
            addressId: 0,
            updatedAt: 0,
          }},{$sort: {
            _id: -1
          }}],
        },
      },
      {
        $project: {
          total: "$total.count",
          data: "$data",
        },
      },
    ]);
    if (!data) throw createHttpError.BadRequest();
    return { total, data };
  }
}

module.exports = new FactorService();
