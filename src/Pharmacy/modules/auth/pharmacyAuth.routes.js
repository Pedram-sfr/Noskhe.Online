
const AuthorizationPharmacy = require("../../../common/guard/authorizationPharmacy.guard");
const authController = require("./pharmacyAuth.controller");
const router = require("express").Router();

router.post("/register",authController.register)
router.post("/login",authController.login)
router.post("/refresh-token",authController.refreshToken)
router.get("/logout",AuthorizationPharmacy,authController.logout)
module.exports = {
    PharmacyAuthRouter: router
}