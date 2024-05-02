const Authorization = require("../../../common/guard/authorization.guard");
const userController = require("./user.controller");

const router = require("express").Router();

router.get("/profile",Authorization,userController.profile)
router.post("/edit-profile",Authorization,userController.editProfile)
module.exports = {
    UserARouter: router
}