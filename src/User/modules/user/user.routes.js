const walletController = require("../../../Wallet/modules/order/wallet.controller");
const Authorization = require("../../../common/guard/authorization.guard");
const userController = require("./user.controller");

const router = require("express").Router();

router.get("/profile",Authorization,userController.profile)
router.get("/wallet",Authorization,walletController.WalletForUser)
router.get("/document/invoice",Authorization,userController.invoiceList)
router.get("/document/invoice/:id",Authorization,userController.invoice)
router.patch("/edit-profile",Authorization,userController.editProfile)
module.exports = {
    UserARouter: router
}