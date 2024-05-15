
const AuthorizationPharmacy = require("../../../common/guard/authorizationPharmacy.guard");
const RefreshTokenAuth = require("../../../common/guard/refreshToken.guard");
const authController = require("./pharmacyAuth.controller");
const router = require("express").Router();

router.post("/register",authController.register)
router.post("/login",authController.login)
router.post("/refresh-token",authController.refreshToken)
router.get("/logout",RefreshTokenAuth,authController.logout)
module.exports = {
    PharmacyAuthRouter: router
}