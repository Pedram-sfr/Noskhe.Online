const Authorization = require("../../../common/guard/authorization.guard");
const userController = require("./user.controller");

const router = require("express").Router();

router.get("/profile",Authorization,userController.profile)
router.patch("/edit-profile",Authorization,userController.editProfile)
module.exports = {
    UserARouter: router
}