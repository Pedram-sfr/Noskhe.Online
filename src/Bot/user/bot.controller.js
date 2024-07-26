const { model, default: mongoose } = require("mongoose");
const BotService = require("./bot.service");
const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const { codeGen } = require("../../common/function/function");
const redisClient = require("../../common/utils/initRedis");
const BotModel = require("./bot.model");
class BotController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = BotService;
  }
  async activeChat(req, res, next) {
    try {
      const { auth,activeCode,chat_id,userName } = req.body;
      if(auth === process.env.BOT_ACTIVE_TOKEN){
        let userId;
        const keys = await redisClient.keys('*');
        for(var i = 0, len = keys.length; i < len; i++) {
          const value = await redisClient.get(keys[i])
          if(value === activeCode) userId = keys[i];
        }
        if (!userId)
          throw new createHttpError.NotFound();
        const bot = await BotModel.find({chat_id});
        if(bot.length > 0) throw createHttpError.BadRequest()
        await BotModel.create({
          pharmacyId: userId,
          chat_id,
          userName
        });
      }
      else throw createHttpError.BadRequest()
      return res.status(200).json({
        statusCode: 200,
        data: {
          message: "OK",
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async getCodeNumber(req, res, next) {
    try {
      const { userId } = req.pharmacyuser;
      const user = await this.#service.findPharmacy(userId);
      const otpcode = await redisClient.get(userId);
      if (otpcode)
        throw new createHttpError.BadRequest("CodeNotExpires");
      const code= codeGen()
      await redisClient.set(String(userId), code, { EX: 60*60*24}, (err) => {
        if (err) return err.message;
      });
      return res.status(200).json({
        statusCode: 200,
        data: {
          code,
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async logout(req, res, next) {
    try {
      const { auth,chat_id } = req.body;
      if(auth === process.env.BOT_ACTIVE_TOKEN){
        const bot = await BotModel.deleteOne({chat_id});
        if(bot.deletedCount == 0 ) throw createHttpError.BadRequest()
      }else throw createHttpError.BadRequest()
      return res.status(200).json({
        statusCode: 200,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BotController();
