const paymentController = require("./payment.controller");
const Authorization = require("../../../common/guard/authorization.guard");

const router = require("express").Router();

router.post("/payment",Authorization,paymentController.payment)

module.exports = {
    PaymentRouter: router
}