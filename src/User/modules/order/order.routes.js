const Authorization = require("../../../common/guard/authorization.guard");
const { stringToArray } = require("../../../common/middleware/stringToArray");
const {  upload, uploadimage } = require("../../../common/utils/multer");
const orderController = require("./order.controller");
const {} = require("multer");

const router = require("express").Router();

router.post("/person/pharmacyList", Authorization, orderController.pharmacyList);
router.post(
  "/addOTC",
  Authorization,
  uploadimage.single('image'),
  orderController.addOTC
);
router.get("/list", Authorization, orderController.OrderList);
router.get("/:orderId", Authorization, orderController.OrderWithOrderId);
router.post(
  "/uploadPrescription",
  Authorization,
  uploadimage.single('image'),
  orderController.addUploadPrescription
);
router.post(
  "/elecPrescription",
  Authorization,
  orderController.addElecPrescription
);
router.post("/create", Authorization, orderController.createOrder);
router.post("/person/create", Authorization, orderController.createPersonOrder);
router.get("/invoice/:orderId", Authorization, orderController.invoice);
router.get("/check/:addressId", Authorization, orderController.checkPharmAroundUser);
// router.post("/OrderToPharmacy",orderController.addOrderToPharmacy)
module.exports = {
  OrderRouter: router,
};
