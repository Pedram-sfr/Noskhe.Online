const Authorization = require("../../../common/guard/authorization.guard");
const RefreshTokenAuth = require("../../../common/guard/refreshToken.guard");
const authController = require("./auth.controller");

const router = require("express").Router();

router.post("/send-otp",authController.sendOTP)
router.post("/check-otp",authController.checkOTP)
router.post("/register/send-otp",authController.sendRegisterOTP)
router.post("/register/check-otp",authController.registerCheckOTP)
router.post("/refresh-token",authController.refreshToken)
router.get("/logout",RefreshTokenAuth,authController.logout)
module.exports = {
    AuthRouter: router
}