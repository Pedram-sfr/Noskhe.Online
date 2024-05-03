const Authorization = require("../../../common/guard/authorization.guard");
const { stringToArray } = require("../../../common/middleware/stringToArray");
const { uploadFile } = require("../../../common/utils/multer");
const orderController = require("./order.controller");
const { } = require("multer")

const router = require("express").Router();


router.post("/addOTC",Authorization,uploadFile.single("image"),orderController.addOTC)
router.get("/list/:orderId",Authorization,orderController.OrderList)
router.post("/uploadPrescription",Authorization,uploadFile.single("image"),orderController.addUploadPrescription)
router.post("/elecPrescription",Authorization,orderController.addElecPrescription)
router.post("/create",Authorization,orderController.createOrder)
module.exports = {
    OrderRouter: router
}