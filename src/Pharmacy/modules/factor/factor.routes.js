
const orderController = require("../../../User/modules/order/order.controller");
const AuthorizationPharmacy = require("../../../common/guard/authorizationPharmacy.guard");
const factorController = require("./factor.controller");
const FactorController = require("./factor.controller");

const router = require("express").Router();

router.get("/pdf/:id",AuthorizationPharmacy,FactorController.pdf)
router.get("/invoiceList",AuthorizationPharmacy,FactorController.invoiceList)
router.get("/invoice/:invoiceId",AuthorizationPharmacy,FactorController.invoice)
router.get("/neworder/list",AuthorizationPharmacy,FactorController.newOrderList)
router.get("/neworder/single/:orderId",AuthorizationPharmacy,FactorController.newOrderSingle)
router.get("/order/notAccept/:orderId",AuthorizationPharmacy,orderController.notAcceptOrder)
router.post("/order/AcceptNotPrice",AuthorizationPharmacy,FactorController.acceptOrderWithOutPrice)
router.post("/order/Accept",AuthorizationPharmacy,FactorController.acceptOrder)
router.get("/orderList",AuthorizationPharmacy,FactorController.orderList)
router.get("/orderList/confirmed",AuthorizationPharmacy,FactorController.confirmedOrderList)
router.get("/orderList/paid/wfc",AuthorizationPharmacy,FactorController.WFCOrderList)
router.get("/orderList/paid/courier",AuthorizationPharmacy,FactorController.currentCourierOrderList)
router.get("/orderList/paid/person",AuthorizationPharmacy,FactorController.currentPersonOrderList)
router.get("/order/:orderId",AuthorizationPharmacy,FactorController.order)
router.post("/create",AuthorizationPharmacy,FactorController.createFactor)
router.post("/createPerson",AuthorizationPharmacy,FactorController.createPersonDeliveryFactor)
router.post("/createDrug",AuthorizationPharmacy,FactorController.drugFactor)
router.patch("/removeDrug",AuthorizationPharmacy,FactorController.removeDrugFromFactor)
router.patch("/order/price",AuthorizationPharmacy,FactorController.addPriceToFactor)
module.exports = {
    FactorRouter: router
}