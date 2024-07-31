const autoBind = require("auto-bind");
const OrderModel = require("./order.model");
const createHttpError = require("http-errors");
const { OrderMessages } = require("./order.messages");
const PharmacyUserModel = require("../../../Pharmacy/modules/user/pharmacyUser.model");
const PharmacyOrderModel = require("./pharmacyOrder.model");
const botService = require("../../../Bot/user/bot.service");
const { sendMessgeWithBot } = require("../../../common/function/function");
const { sendSMS } = require("../../../common/utils/http");

class OrderService {
  #model;
  #pharmModel;
  constructor() {
    autoBind(this);
    this.#pharmModel = PharmacyUserModel;
    this.#model = OrderModel;
  }
  async createOrder(ord) {
    const res = await this.#model.create(ord);
    if (!res) throw createHttpError.InternalServerError("خطای سرور");
    return res;
  }
  async addOTCImage(orderId, userId, image, count, type) {
    const res = await this.#model.updateOne(
      { _id: orderId, userId },
      {
        $push: {
          otc: {
            image,
            count,
            type,
          },
        },
      }
    );
    if (res.modifiedCount == 0) throw createHttpError.InternalServerError(ord);
    return res;
  }
  async addOTC(orderId, userId, type, count, drugName) {
    const res = await this.#model.updateOne(
      { _id: orderId, userId },
      {
        $push: {
          otc: {
            count,
            type,
            drugName,
          },
        },
      }
    );
    if (res.modifiedCount == 0) throw createHttpError.InternalServerError(ord);
    return res;
  }
  async addUploadPrescription(orderId, userId, data) {
    const res = await this.#model.updateOne(
      { _id: orderId, userId },
      {
        $push: {
          uploadPrescription: data,
        },
      }
    );
    if (res.modifiedCount == 0) throw createHttpError.InternalServerError(data);
    return res;
  }
  async addElecPrescription(
    orderId,
    userId,
    trackingCode,
    doctorName,
    nationalCode,
    typeOfInsurance
  ) {
    const res = await this.#model.updateOne(
      { _id: orderId, userId },
      {
        $push: {
          elecPrescription: {
            trackingCode,
            doctorName,
            nationalCode,
            typeOfInsurance,
          },
        },
      }
    );
    if (res.modifiedCount == 0) throw createHttpError.InternalServerError(data);
    return res;
  }
  async addOrderToPerson(pharmacyId, orderId,refId) {
    // const result = await PharmacyOrderModel.create({
    //   orderId,
    //   pharmacyId,
    // });
    const result = await PharmacyOrderModel.create({
      refId,
      orderId,
      pharmacyId,
    });
    return result;
  }
  async addOrderToPharmacy(coordinate, orderId, refId) {
    const order = await this.#model.findOne({ _id: orderId });
    const pharm = await this.calDistanceCordinate(coordinate);
    let result;
    if (pharm.length == 1)
      result = await PharmacyOrderModel.create({
        refId,
        orderId,
        pharmacyId: pharm[0],
      });
    else if (pharm.length == 2)
      result = await PharmacyOrderModel.create({
        refId,
        orderId,
        pharmacyId: pharm[0],
        priority: [pharm[1]],
      });
    else if (pharm.length >= 3)
      result = await PharmacyOrderModel.create({
        refId,
        orderId,
        pharmacyId: pharm[0],
        priority: [pharm[1], pharm[2]],
      });
    else if (pharm.length == 0) {
      order.status = "FAILED";
      order.save();
      throw createHttpError.NotFound("داروخانه ای در محدوده شما یافت نشد");
    }
    const user = await OrderModel.findById(orderId);
    const res = await botService.sendMessage(pharm[0], user.fullName, refId);
    const smstext = `${user.fullName} عزیز \nدرخواست شما با شماره پیگیری ${refId} ثبت گردید.`;
    const { Status, ErrorCode, Success } = await sendSMS(smstext, user.mobile);
    return result;
  }
  async notAcceptOrderToPharmacy(id) {
    const pharm = await PharmacyOrderModel.findById(id);
    let result;
    if (pharm.priority.length == 1){
      result = await PharmacyOrderModel.updateOne(
        { _id: id },
        { pharmacyId: pharm.priority[0], priority: [], status: "PENDING" }
      );
    }
    else if (pharm.priority.length == 2){
      result = await PharmacyOrderModel.updateOne(
        { _id: id },
        {
          pharmacyId: pharm.priority[0],
          priority: [pharm.priority[1]],
          status: "PENDING",
        }
      );
    }
    else if (pharm.priority.length == 3){
      result = await PharmacyOrderModel.updateOne(
        { _id: id },
        {
          pharmacyId: pharm.priority[0],
          priority: [pharm.priority[1], pharm.priority[2]],
          status: "PENDING",
        }
      );
    }
    else if (pharm.priority.length == 0) {
      const order = await this.#model.findOne(pharm.orderId);
      const res = await PharmacyOrderModel.deleteOne({ _id: pharm._id });
      order.status = "FAILED";
      order.save();
      return res;
    }
    const user = await OrderModel.findById(pharm.orderId);
    const res = await botService.sendMessage(
      pharm.priority[0],
      user.fullName,
      pharm.refId
    );

    return result;
  }

  async calDistanceCordinate(cor) {
    // const data = await this.#pharmModel.aggregate([
    //    { $geoNear: {
    //         near: { type: "Point", coordinates: cor},
    //         spherical: true,
    //         distanceField: "calculatedDistance",
    //         maxDistance: 7000,
    //         key: "location"
    //     }}
    // ])
    const data = await this.#pharmModel.find({
      coordinates: {
        $geoWithin: {
          $centerSphere: [cor, 2 / 6378.1],
        },
      },
    });
    return data;
  }
  async findPharmacyAroundUser(cor,pageNumber,pageSize) {
    // const data = await this.#pharmModel.find(
    //   {
    //     coordinates: {
    //       $geoWithin: {
    //         $centerSphere: [cor, 10 / 6378.1],
    //       },
    //     },
    //   },
    //   { address: 1, city: 1, province: 1, _id: 1, pharmacyName: 1 }
    // );

    // return data;

    const [{ total, data }] = await this.#pharmModel.aggregate([
      {
        $match:{
          coordinates: {
            $geoWithin: {
              $centerSphere: [cor, 20 / 6378.1],
            },
          },
        }
      },
      {
        $facet: {
          total: [{ $group: { _id: null, count: { $sum: 1 } } }],
          data: [{ $skip: (pageNumber - 1) * pageSize }, { $limit: pageSize },{$project: {
            address: 1, city: 1, province: 1, _id: 1, pharmacyName: 1
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
    if (!data) throw createHttpError.NotFound();
    return { total, data };
  }
}

module.exports = new OrderService();
