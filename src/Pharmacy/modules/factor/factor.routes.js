
const orderController = require("../../../User/modules/order/order.controller");
const AuthorizationPharmacy = require("../../../common/guard/authorizationPharmacy.guard");
const factorController = require("./factor.controller");
const FactorController = require("./factor.controller");

const router = require("express").Router();

router.get("/pdf/:id",FactorController.pdf)
router.get("/neworder/list",AuthorizationPharmacy,FactorController.newOrderList)
router.get("/order/notAccept/:id",AuthorizationPharmacy,orderController.notAcceptOrder)
router.get("/order/Accept/:id",AuthorizationPharmacy,FactorController.acceptOrder)
router.get("/orderList",AuthorizationPharmacy,FactorController.orderList)
router.get("/order/:orderId",AuthorizationPharmacy,FactorController.order)
router.post("/create",AuthorizationPharmacy,FactorController.createFactor)
router.patch("/removeDrug",AuthorizationPharmacy,FactorController.removeDrugFromFactor)
router.post("/dis",FactorController.dis)
module.exports = {
    FactorRouter: router
}