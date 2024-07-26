const autoBind = require("auto-bind");
const BotModel = require("./bot.model");
const createHttpError = require("http-errors");
const { Types } = require("mongoose");
const PharmacyUserModel = require("../../Pharmacy/modules/user/pharmacyUser.model");
const { default: axios } = require("axios");

class BotService {
  #model;
  #fmodel;
  constructor() {
    autoBind(this);
    this.#model = BotModel;
    this.#fmodel = PharmacyUserModel;
  }

  async findPharmacy(userId) {
    console.log(userId);
    // const user = await this.#model.findOne({userName},{_id: 0,otp: 0,verfiedMobile:0,createdAt: 0,updatedAt:0,});
    const user = await this.#fmodel.findById(userId);
    if (!user) throw createHttpError.NotFound();
    return user;
  }
  async sendMessage(pharmacyId, name, refId) {
    const pharm = await this.#model.find({ pharmacyId });
    const user = await this.#fmodel.findById(pharmacyId);
    const text = `داروخانه ${user.pharmacyName} سفارشی به شماره پیگیری *${refId}* به نام *${name}* برای شما ارسال شده است ، لطفا تا *۵ دقیقه* دیگر اقدام به تایید یا رد آن نمایید . \n
    پلتفرم نسخه آنلاین`;

    if (pharm.length > 0) {
      for (let i = 0; i < pharm.length; i++) {
        const result = await axios
          .get(
            `${process.env.BOT_URL}/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${pharm[i].chat_id}&text=${text}`
          )
          .then((res) => res.data);
      }
    } else return 0;
    return 1;
  }
}

module.exports = new BotService();
