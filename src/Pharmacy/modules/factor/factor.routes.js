
const AuthorizationPharmacy = require("../../../common/guard/authorizationPharmacy.guard");
const FactorController = require("./factor.controller");

const router = require("express").Router();

router.get("/pdf",FactorController.pdf)
router.get("/orderList",AuthorizationPharmacy,FactorController.orderList)
router.get("/order/:orderId",AuthorizationPharmacy,FactorController.order)
router.post("/create",AuthorizationPharmacy,FactorController.createFactor)
module.exports = {
    FactorRouter: router
}