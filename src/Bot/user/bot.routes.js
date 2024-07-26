const AuthorizationPharmacy = require("../../common/guard/authorizationPharmacy.guard");
const BotController = require("./bot.controller");

const router = require("express").Router();

router.get("/getCode",AuthorizationPharmacy,BotController.getCodeNumber);
router.post("/activeChat",BotController.activeChat);
router.post("/logout",BotController.logout);
module.exports = {
    BotRouter: router
}