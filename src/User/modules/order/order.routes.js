const Authorization = require("../../../common/guard/authorization.guard");
const { stringToArray } = require("../../../common/middleware/stringToArray");
const orderController = require("./order.controller");

const router = require("express").Router();


router.post("/add",stringToArray("list"),orderController.add)
module.exports = {
    OrderRouter: router
}