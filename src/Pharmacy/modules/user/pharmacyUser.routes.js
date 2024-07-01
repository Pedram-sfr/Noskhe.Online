
const walletController = require("../../../Wallet/modules/order/wallet.controller");
const AuthorizationPharmacy = require("../../../common/guard/authorizationPharmacy.guard");
const PharmacyUserController = require("./pharmacyUser.controller");

const router = require("express").Router();

router.get("/dashboard",AuthorizationPharmacy,PharmacyUserController.dashboard)
router.get("/profile",AuthorizationPharmacy,PharmacyUserController.profile)
router.get("/wallet",AuthorizationPharmacy,walletController.WalletForPharmceyUser)
router.patch("/edit-profile",AuthorizationPharmacy,PharmacyUserController.editProfile)
module.exports = {
    PharmacyUserRouter: router
}