const { model, default: mongoose } = require("mongoose");
const PharmacyUserService = require("./pharmacyUser.service");
const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const { deleteNulishObject } = require("../../../common/function/function");
class PharmacyUserController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = PharmacyUserService;
  }
  async dashboard(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const uorder = await this.#service.countOfUnconfirmedOrders(userId);
      const cOrder = await this.#service.countOfConfirmedOrders(userId);
      const cCOrder = await this.#service.countOfCurrentCourierOrders(userId);
      const cPOrder = await this.#service.countOfCurrentPersonOrders(userId);
      const WFCOrder = await this.#service.countOfWFCOrders(userId);
      const orders = await this.#service.countOfOrders(userId);
      let data = {};
      data["UNCONFIRMED_ORDERS"] = uorder;
      data["CONFIRMED_ORDERS"] = cOrder;
      data["CURRENT_COURIER_ORDERS"] = cCOrder;
      data["CURRENT_PERSON_ORDERS"] = cPOrder;
      data["WFC_ORDERS"] = WFCOrder;
      data["ALL_OF_ORDERS"] = orders;
      return res.status(200).json({
        statusCode: 200,
        data,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async profile(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const user = await this.#service.findPharmacyUser(userId);
      return res.status(200).json({
        statusCode: 200,
        data: {
          user,
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async editProfile(req, res, next) {
    try {
      const { userName } = req.pharmacyuser;
      const data = req.body;
      await this.#service.findPharmacyUser(userName);
      const coordinates = JSON.parse(data.coordinates);
      data.coordinates = coordinates;
      console.log(data);
      deleteNulishObject(data);
      const updateuserResualt = await this.#service.updatePharmacyUser(
        userName,
        data
      );
      if (!updateuserResualt.modifiedCount)
        throw createHttpError.InternalServerError("به روزرسانی انجام نشد");
      return res.status(200).json({
        statusCode: 200,
        data: {
          message: "بروزرسانی با موفقیت انجام شد",
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PharmacyUserController();
