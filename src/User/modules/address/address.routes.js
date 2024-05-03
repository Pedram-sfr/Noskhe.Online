const Authorization = require("../../../common/guard/authorization.guard");
const addressController = require("./address.controller");

const router = require("express").Router();

router.post("/add",Authorization,addressController.createAddress)
router.patch("/update",Authorization,addressController.editAddress)
router.delete("/remove/:addressId",Authorization,addressController.removeAddress)
router.get("/list",Authorization,addressController.addressList)
module.exports = {
    AddressRouter: router
}