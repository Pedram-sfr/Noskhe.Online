const FactorService = require("./factor.service");
const autoBind = require("auto-bind");
const {
  dateToJalali,
  createPdf,
  codeGen,
  isFalse,
  isTrue,
} = require("../../../common/function/function");
const OrderModel = require("../../../User/modules/order/order.model");
const {
  addWalletDetail,
} = require("../../../Wallet/modules/order/wallet.service");
const createHttpError = require("http-errors");
const PharmacyOrderModel = require("../../../User/modules/order/pharmacyOrder.model");
const { pagination } = require("../../../common/function/pagination");
const FactorModel = require("./factor.model");
const DrugModel = require("../drug/drug.model");
const { default: mongoose } = require("mongoose");
const { InventoryIncludedObjectVersions } = require("@aws-sdk/client-s3");
class FactorController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = FactorService;
  }
  async createPersonDeliveryFactor(req, res, next) {
    try {
      const { userId: pharmacyId } = req.pharmacyuser;
      const { orderId, deliveryTime } = req.body;
      const order = await OrderModel.findById({ _id: orderId });
      if (!order) throw new createHttpError.NotFound();
      const data = {
        invoiceId: codeGen(),
        pharmacyId,
        userId: order.userId,
        orderId,
        addressId: order.addressId,
        deliveryTime,
        deliveryType: "PERSON",
      };
      const { _id: factorId } = await this.#service.createFactor(data);
      order.status = "SUCCESS";
      order.save();
      return res.status(200).json({
        statusCode: 200,
        data: {
          factorId,
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async createFactor(req, res, next) {
    try {
      const { userId: pharmacyId } = req.pharmacyuser;
      const { orderId } = req.body;
      const order = await OrderModel.findById({ _id: orderId });
      if (!order) throw new createHttpError.NotFound();
      const data = {
        invoiceId: codeGen(),
        pharmacyId,
        userId: order.userId,
        orderId,
        addressId: order.addressId,
        shippingCost: 20000,
      };
      const { _id: factorId } = await this.#service.createFactor(data);
      order.status = "SUCCESS";
      order.save();
      return res.status(200).json({
        statusCode: 200,
        data: {
          factorId,
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async drugFactor(req, res, next) {
    try {
      const { userId: pharmacyId } = req.pharmacyuser;
      const { factorId, drugId, count, action } = req.body;
      let total = 0;
      const factor = await FactorModel.findOne({ _id: factorId, pharmacyId });
      if (!factor) throw new createHttpError.NotFound();
      const drugs = await DrugModel.findOne(
        { pharmacyId, "drugs._id": drugId },
        { "drugs.$": 1 }
      );
      if (!drugs) throw new createHttpError.NotFound();
      const drug = drugs.drugs[0];
      total = drugs.drugs[0].patient * count;
      if (action == "INCREMENT") {
        factor.totalPrice += total;
        factor.insurancePrice += drugs.drugs[0].insurance * count;
        factor.price += drugs.drugs[0].price * count;
        const drugf = await FactorModel.findOne(
          { _id: factorId, "drugs.drugId": drugId },
          { "drugs.$": 1 }
        );
        if (drugf) {
          await FactorModel.updateOne(
            { _id: factorId, "drugs.drugId": drugId },
            {
              $set: {
                "drugs.$": {
                  count: parseInt(drugf.drugs[0].count) + parseInt(count),
                  total: drugf.drugs[0].total + total,
                  drugId,
                  drugName: drug.drugName,
                  drugType: drug.drugType,
                  price: drug.price,
                  patient: drug.patient,
                  insurance: drug.insurance,
                },
              },
            }
          );
        } else {
          console.log("2");
          await FactorModel.updateOne(
            { _id: factorId },
            {
              $push: {
                drugs: {
                  count: count,
                  drugName: drug.drugName,
                  drugType: drug.drugType,
                  price: drug.price,
                  patient: drug.patient,
                  insurance: drug.insurance,
                  total: total,
                  drugId,
                },
              },
            }
          );
        }
      }
      if (action == "DECREMENT") {
        factor.totalPrice -= total;
        factor.insurancePrice -= drugs.drugs[0].insurance * count;
        factor.price -= drugs.drugs[0].price * count;
        const drugf = await FactorModel.findOne(
          { _id: factorId, "drugs.drugId": drugId },
          { "drugs.$": 1 }
        );
        if (drugf) {
          if (parseInt(drugf.drugs[0].count) > parseInt(count)) {
            await FactorModel.updateOne(
              { _id: factorId, "drugs.drugId": drugId },
              {
                $set: {
                  "drugs.$": {
                    count: parseInt(drugf.drugs[0].count) - parseInt(count),
                    total: drugf.drugs[0].total - total,
                    drugId,
                    drugName: drug.drugName,
                    drugType: drug.drugType,
                    price: drug.price,
                    patient: drug.patient,
                    insurance: drug.insurance,
                  },
                },
              }
            );
          } else if (parseInt(drugf.drugs[0].count) == parseInt(count)) {
            await FactorModel.updateOne(
              { _id: factorId, "drugs.drugId": drugId },
              {
                $pull: {
                  drugs: {
                    _id: drugf.drugs[0]._id,
                  },
                },
              }
            );
          } else {
            throw new createHttpError.InternalServerError();
          }
        } else {
          throw new createHttpError.NotFound();
        }
      }
      factor.save();
      return res.status(200).json({
        statusCode: 200,
        data: {
          factorId,
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async removeDrugFromFactor(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const { invoiceId, drug } = req.body;
      const drugs = JSON.parse(drug);
      let total = 0,
        data = {},
        phData = {};
      for (let i = 0; i < drugs.length; i++) {
        total += await this.#service.deleteDrugInFactor(
          userId,
          invoiceId,
          drugs[i]
        );
      }
      const factor = await this.#service.findFactor(invoiceId, userId);
      console.log(factor.drugs);
      if (factor.drugs.length == 0) {
        data = {
          RefNo: codeGen(),
          amount: total + factor.shippingCost,
          invoiceId,
          description: `اصلاحیه فاکتور شماره ${invoiceId}`,
          state: "برگشت به کیف پول",
          status: true,
        };
        factor.active = false;
      } else {
        data = {
          RefNo: codeGen(),
          amount: total,
          invoiceId,
          description: `اصلاحیه فاکتور شماره ${invoiceId}`,
          state: "برگشت به کیف پول",
          status: true,
        };
      }
      phData = {
        RefNo: codeGen(),
        amount: total,
        invoiceId,
        description: `اصلاحیه فاکتور شماره ${invoiceId}`,
        state: "کسر از کیف پول",
        status: false,
      };
      factor.totalPrice = factor.totalPrice - total;
      factor.save();
      await addWalletDetail(factor.userId, data);
      await addWalletDetail(userId, phData);
      return res.status(200).json({
        statusCode: 200,
        data: {
          message: "success",
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async invoiceList(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const pageNumber = parseInt(req.query.page || 1); // Get the current page number from the query parameters
      const pageSize = parseInt(req.query.perpage || 10);
      const order = await this.#service.findFactorList(userId);
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
  async invoice(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const { invoiceId } = req.params;
      const factor = await this.#service.findFactor(invoiceId, userId);
      return res.status(200).json({
        statusCode: 200,
        factor,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async orderList(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const pageNumber = parseInt(req.query.page || 1); // Get the current page number from the query parameters
      const pageSize = parseInt(req.query.perpage || 10);
      const list = req.query.list;
      const sch = req.query.search;
      const search = new RegExp(sch, "ig");
      let data;
      if (list == "ALL") {
        data = await this.#service.orderListForPharmacy(
          userId,
          pageNumber,
          pageSize,
          search
        );
      } else if (list == "PERSON") {
        data = await this.#service.findOrdersWithStatus(
          userId,
          "PAID",
          "PERSON",
          pageNumber,
          pageSize,
          search
        );
      } else if (list == "COURIER") {
        data = await this.#service.findOrdersWithStatus(
          userId,
          "PAID",
          "COURIER",
          pageNumber,
          pageSize,
          search
        );
      } else if (list == "WFC") {
        data = await this.#service.findOrdersWithStatus(
          userId,
          "WFC",
          "COURIER",
          pageNumber,
          pageSize,
          search
        );
      } else if (list == "CONFIRMED") {
        data = await this.#service.findConfirmedOrders(
          userId,
          "WFP",
          pageNumber,
          pageSize,
          search
        );
      } else throw createHttpError.BadRequest("NotFountQuery");
      const result = pagination(data.data, pageNumber, pageSize, data.total[0]);
      return res.status(200).json({
        statusCode: 200,
        list,
        result,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async currentPersonOrderList(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const pageNumber = parseInt(req.query.page || 1); // Get the current page number from the query parameters
      const pageSize = parseInt(req.query.perpage || 10);
      const order = await this.#service.findOrdersWithStatus(
        userId,
        "PAID",
        "PERSON"
      );
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
  async currentCourierOrderList(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const pageNumber = parseInt(req.query.page || 1); // Get the current page number from the query parameters
      const pageSize = parseInt(req.query.perpage || 10);
      const order = await this.#service.findOrdersWithStatus(
        userId,
        "PAID",
        "COURIER"
      );
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
  async WFCOrderList(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const pageNumber = parseInt(req.query.page || 1); // Get the current page number from the query parameters
      const pageSize = parseInt(req.query.perpage || 10);
      const order = await this.#service.findOrdersWithStatus(
        userId,
        "WFC",
        "COURIER"
      );
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
  async confirmedOrderList(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const pageNumber = parseInt(req.query.page || 1); // Get the current page number from the query parameters
      const pageSize = parseInt(req.query.perpage || 10);
      const order = await this.#service.findConfirmedOrders(userId, "PENDING");
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
  async order(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const { factorId } = req.params;
      const data = await this.#service.orderForPharmacy(userId, factorId);
      return res.status(200).json({
        statusCode: 200,
        data,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async acceptOrderWithOutPrice(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const { orderId } = req.body;
      let data = {};
      const po = await PharmacyOrderModel.findOne({
        orderId,
        pharmacyId: userId,
      });
      if (!po) throw createHttpError.BadRequest();
      po.status = "WAITING";
      po.save();
      return res.status(200).json({
        statusCode: 200,
        data: {
          message: "accepted",
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async acceptOrder(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const { orderId, deliveryTime, deliveryType } = req.body;
      let data = {};
      const nowDate = new Date().getTime();
      const po = await PharmacyOrderModel.findOne({
        orderId,
        pharmacyId: userId,
      });
      if (!po) throw createHttpError.BadRequest();
      const order = await OrderModel.findById(po.orderId);
      if (!order) throw createHttpError.BadRequest();
      order.pharmId = userId;
      order.accepted = true;
      order.status = "WFP";
      order.save();
      await PharmacyOrderModel.deleteOne({ _id: po._id });
      if (deliveryType == "PERSON") {
        data = {
          invoiceId: order.refId,
          pharmacyId: userId,
          userId: order.userId,
          orderId: order._id,
          addressId: order.addressId,
          fullName: order.fullName,
          deliveryTime: new Date(nowDate + deliveryTime * 60000),
          deliveryType: "PERSON",
        };
      } else if (deliveryType == "COURIER") {
        data = {
          invoiceId: order.refId,
          pharmacyId: userId,
          userId: order.userId,
          orderId: order._id,
          addressId: order.addressId,
          shippingCost: 20000,
          fullName: order.fullName,
          deliveryTime: new Date(nowDate + 60 * 60000),
        };
      }
      const { _id: factorId } = await this.#service.createFactor(data);
      return res.status(200).json({
        statusCode: 200,
        data: {
          factorId,
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async newOrderList(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const pageNumber = parseInt(req.query.page || 1); // Get the current page number from the query parameters
      const pageSize = parseInt(req.query.perpage || 10);
      const sch = req.query.search;
      const search = new RegExp(sch, "ig");
      const { data, total } = await this.#service.findNewOrder(
        userId,
        pageNumber,
        pageSize,
        search
      );
      const result = pagination(data, pageNumber, pageSize, total[0]);
      return res.status(200).json({
        statusCode: 200,
        result,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async newOrderSingle(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const { orderId } = req.params;
      const data = await this.#service.findNewOrderSingle(userId, orderId);
      return res.status(200).json({
        statusCode: 200,
        data,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async pdf(req, res, next) {
    try {
      const { id } = req.params;
      const data = await this.#service.findFactorForPrint(id);
      const factor = data[0];
      if (isFalse(factor.active)) throw createHttpError.NotFound();
      const { date, time } = dateToJalali(factor?.createdAt);
      factor.time = time;
      factor.date = date;

      // createPdf(factor);
      return res.render("invoice.ejs", { factor });
    } catch (error) {
      next(error);
    }
  }
  async deliveryToCourier(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const { factorId } = req.body;
      const invoice = await FactorModel.findOne({
        _id: factorId,
        pharmacyId: userId,
      });
      const order = await OrderModel.findOne({
        _id: invoice.orderId,
        userId: invoice.userId,
      });
      if (invoice.deliveryType == "COURIER" && isTrue(invoice.paymentStatus)) {
        invoice.status = "SENT";
        order.status = "SENT";
        invoice.save();
        order.save();
      } else throw createHttpError.BadRequest();
      return res.status(200).json({
        statusCode: 200,
        data: {
          message: "ok",
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async deliveryToPerson(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const { factorId } = req.body;
      const invoice = await FactorModel.findOne({
        _id: factorId,
        pharmacyId: userId,
      });
      const order = await OrderModel.findOne({
        _id: invoice.orderId,
        userId: invoice.userId,
      });
      if (invoice.deliveryType == "PERSON" && isTrue(invoice.paymentStatus)) {
        invoice.status = "DELIVERED";
        order.status = "DELIVERED";
        invoice.save();
        order.save();
      } else throw createHttpError.BadRequest();
      return res.status(200).json({
        statusCode: 200,
        data: {
          message: "ok",
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async acceptPrice(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const { invoiceId } = req.body;
      const invoice = await FactorModel.findOne({
        _id: invoiceId,
        pharmacyId: userId,
      });
      let price = 0,
        totalPrice = 0,
        insurance = 0;
      const otc = invoice.otc;
      const upload = invoice.uploadPrescription;
      const elec = invoice.elecPrescription;
      if (otc.length > 0) {
        for (let i = 0; i < otc.length; i++) {
          price += parseInt(otc[i].price);
          totalPrice += parseInt(otc[i].total);
        }
      }
      if (upload.length > 0) {
        for (let i = 0; i < upload.length; i++) {
          price += parseInt(upload[i].price);
          insurance += parseInt(upload[i].insurance);
          totalPrice =
            totalPrice +
            (parseInt(upload[i].price) - parseInt(upload[i].insurance));
        }
      }
      if (elec.length > 0) {
        for (let i = 0; i < elec.length; i++) {
          price += parseInt(elec[i].price);
          insurance += parseInt(elec[i].insurance);
          totalPrice =
            totalPrice +
            (parseInt(elec[i].price) - parseInt(elec[i].insurance));
        }
      }
      invoice.price = price;
      invoice.insurancePrice = insurance;
      invoice.totalPrice = totalPrice;
      invoice.save();
      return res.status(200).json({
        statusCode: 200,
        data: {
          message: "ok",
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async addPriceToFactor(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const { invoiceId, itemId, itemType, price, insurance } = req.body;
      const invoice = await FactorModel.findById(invoiceId);
      // return console.log(invoice.orderId);
      let otcData = {};
      let data = {};
      if (itemType == "OTC") {
        const { otc } = await OrderModel.findOne(
          {
            _id: new mongoose.Types.ObjectId(invoice.orderId),
            pharmId: userId,
            "otc._id": itemId,
          },
          { "otc.$": 1 }
        );
        if (!otc) throw createHttpError.NotFound();
        if (otc[0]?.drugName) {
          data = await FactorModel.updateOne(
            { _id: invoiceId, pharmacyId: userId },
            {
              $push: {
                otc: {
                  count: otc[0].count,
                  type: otc[0].type,
                  drugName: otc[0].drugName,
                  price: price,
                  total: price,
                },
              },
            }
          );
        } else if (otc[0]?.image) {
          data = await FactorModel.updateOne(
            { _id: invoiceId, pharmacyId: userId },
            {
              $push: {
                otc: {
                  count: otc[0].count,
                  type: otc[0].type,
                  image: otc[0].image,
                  price: price,
                  total: price,
                },
              },
            }
          );
        }
        if (data.modifiedCount == 0)
          throw createHttpError.InternalServerError("Nok");
        invoice.price = parseInt(invoice.price) + parseInt(price);
        invoice.totalPrice = parseInt(invoice.totalPrice) + parseInt(price);
        console.log("1 --> ", invoice.price, invoice.totalPrice);
        invoice.save();
      } else if (itemType == "UPLOAD") {
        const { uploadPrescription: upload } = await OrderModel.findOne(
          {
            _id: new mongoose.Types.ObjectId(invoice.orderId),
            pharmId: userId,
            "uploadPrescription._id": itemId,
          },
          { "uploadPrescription.$": 1 }
        );
        if (!upload) throw createHttpError.NotFound();
        data = await FactorModel.updateOne(
          {
            _id: invoiceId,
            pharmacyId: userId,
          },
          {
            $push: {
              uploadPrescription: {
                image: upload[0].image,
                price,
                insurance: insurance,
                patient: price - insurance,
                total: price - insurance,
              },
            },
          }
        );
        if (data.modifiedCount == 0)
          throw createHttpError.InternalServerError("Nok");
        console.log(price, insurance, data);
        invoice.price = parseInt(invoice.price) + parseInt(price);
        invoice.insurancePrice =
          parseInt(invoice.insurancePrice) + parseInt(insurance || 0);
        invoice.totalPrice =
          parseInt(invoice.totalPrice) +
          (parseInt(price) - parseInt(insurance || 0));
        console.log(
          "2 --> ",
          invoice.price,
          invoice.insurancePrice,
          invoice.totalPrice
        );
        invoice.save();
      } else if (itemType == "ELEC") {
        const { elecPrescription: elec } = await OrderModel.findOne(
          {
            _id: new mongoose.Types.ObjectId(invoice.orderId),
            pharmId: userId,
            "elecPrescription._id": itemId,
          },
          { "elecPrescription.$": 1 }
        );
        if (!elec) throw createHttpError.NotFound();
        data = await FactorModel.updateOne(
          {
            _id: invoiceId,
            pharmacyId: userId,
          },
          {
            $push: {
              elecPrescription: {
                typeOfInsurance: elec[0].typeOfInsurance,
                nationalCode: elec[0].nationalCode,
                doctorName: elec[0].doctorName,
                trackingCode: elec[0].trackingCode,
                price,
                insurance: insurance,
                patient: price - insurance,
                total: price - insurance,
              },
            },
          }
        );
        if (data.modifiedCount == 0)
          throw createHttpError.InternalServerError("Nok");
        invoice.price = parseInt(invoice.price) + parseInt(price);
        invoice.insurancePrice =
          parseInt(invoice.insurancePrice) + parseInt(insurance);
        invoice.totalPrice =
          parseInt(invoice.totalPrice) + parseInt(price) - parseInt(insurance);
        console.log(
          "3 --> ",
          invoice.price,
          invoice.insurancePrice,
          invoice.totalPrice
        );
        invoice.save();
      } else throw new createHttpError.BadRequest();
      if (data.modifiedCount == 0)
        throw createHttpError.InternalServerError("Nok");
      return res.status(200).json({
        statusCode: 200,
        data: {
          message: "ok",
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async dis(req, res, next) {
    try {
      const { coordinates } = req.body;
      const data = JSON.parse(coordinates);
      const dis = await this.#service.calDistanceCordinate(data);
      const len = dis.length;
      return res.status(200).json({
        statusCode: 200,
        data: {
          len,
          dis,
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FactorController();
