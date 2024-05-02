const Authorization = require("../../../common/guard/authorization.guard");
const authController = require("./auth.controller");

const router = require("express").Router();

router.post("/send-otp",authController.sendOTP)
router.post("/check-otp",authController.checkOTP)
router.post("/refresh-token",authController.refreshToken)
router.get("/logout",Authorization,authController.logout)
module.exports = {
    AuthRouter: router
}