
const AuthorizationPharmacy = require("../../../common/guard/authorizationPharmacy.guard");
const PharmacyUserController = require("./pharmacyUser.controller");

const router = require("express").Router();

router.get("/profile",AuthorizationPharmacy,PharmacyUserController.profile)
router.patch("/edit-profile",AuthorizationPharmacy,PharmacyUserController.editProfile)
module.exports = {
    PharmacyUserRouter: router
}