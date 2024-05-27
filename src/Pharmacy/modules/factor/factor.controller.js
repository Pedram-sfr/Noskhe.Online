const FactorService = require("./factor.service");
const autoBind = require("auto-bind");
const {
  dateToJalali,
  createPdf,
  codeGen,
  isFalse,
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
class FactorController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = FactorService;
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
      const factor = await this.#service.findFactor(invoiceId);
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
  async orderList(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const pageNumber = parseInt(req.query.page || 1); // Get the current page number from the query parameters
      const pageSize = parseInt(req.query.perpage || 10);
      const order = await this.#service.orderListForPharmacy(userId);
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
      const { orderId } = req.params;
      const pageNumber = parseInt(req.query.page || 1); // Get the current page number from the query parameters
      const pageSize = parseInt(req.query.perpage || 10);
      const order = await this.#service.orderForPharmacy(userId, orderId);
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
  async acceptOrder(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const { id } = req.body;
      const po = await PharmacyOrderModel.findOne({
        orderId: id,
        pharmacyId: userId,
      });
      if (!po) throw createHttpError.BadRequest();
      const order = await OrderModel.findById(po.orderId);
      if (!order) throw createHttpError.BadRequest();
      order.pharmId = userId;
      order.accepted = true;
      order.status = "SUCCESS";
      order.save();
      await PharmacyOrderModel.deleteOne({ _id: po._id });
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
  async newOrderList(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const pod = await this.#service.findNewOrder(userId);
      return res.status(200).json({
        statusCode: 200,
        data: {
          pod,
        },
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
