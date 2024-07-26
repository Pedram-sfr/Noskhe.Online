const autoBind = require("auto-bind");
const UserModel = require("../user/user.model");
const createHttpError = require("http-errors");
const { AuthMessages } = require("./auth.messages");
const { randomInt } = require("crypto");
const jwt = require("jsonwebtoken");
const { resolve } = require("path");
const { rejects } = require("assert");
const {
  findWalletByUserId,
  createWallet,
} = require("../../../Wallet/modules/order/wallet.service");
const { isFalse } = require("../../../common/function/function");
const { sendOTPSMS, sendSMS } = require("../../../common/utils/http");
const redisClient = require("../../../common/utils/initRedis");

class AuthService {
  #model;
  constructor() {
    autoBind(this);
    this.#model = UserModel;
  }
  async sendRegisterOTP(mobile) {
    const user = await this.#model.findOne({ mobile });
    if(user) throw new createHttpError.Unauthorized("کاربر وجود دارد");
    const otpcode = await redisClient.get(mobile);
    if (otpcode)
      throw new createHttpError.BadRequest(AuthMessages.OTPCodeNotExpired);
    const now = new Date().getTime();
    const code = randomInt(10000, 99999);
    await redisClient.set(String(mobile), code, { EX: 120 }, (err) => {
      if (err) return err.message;
    });
    const smstext = `کد احراز هویت شما در نسخه آنلاین: ${code}`
    const {Status,ErrorCode,Success} = await sendSMS(smstext,mobile)
    return code;
  }
  async sendLoginOTP(mobile) {
    const user = await this.#model.findOne({ mobile });
    if(!user) throw new createHttpError.Unauthorized("کاربر بافت نشد");
    const otpcode = await redisClient.get(mobile);
    if (otpcode)
      throw new createHttpError.BadRequest(AuthMessages.OTPCodeNotExpired);
    const code = randomInt(10000, 99999);
    await redisClient.set(String(mobile), code, { EX: 120 }, (err) => {
      if (err) return err.message;
    });
    const smstext = `کد احراز هویت شما در نسخه آنلاین: ${code}`
    const {Status,ErrorCode,Success} = await sendSMS(smstext,mobile)
    return code;
  }
  async checkOTP(mobile, code) {
    const user = await this.#model.findOne({ mobile });
    const wallet = await findWalletByUserId(user?._id);
    if (!user) throw new createHttpError.Unauthorized("کاربر بافت نشد");
    if (isFalse(wallet)) await createWallet(user._id);
    const otpcode = await redisClient.get(mobile)
    if (!otpcode)
      throw new createHttpError.Unauthorized(AuthMessages.OTPCodeExpired);
    if (otpcode !== code)
      throw new createHttpError.Unauthorized(AuthMessages.OTPCodeInCorrect);
    const accessToken = this.signAccessToken({ mobile, userId: user._id });
    const refreshToken = this.signRefreshToken({ mobile, userId: user._id });
    return { accessToken, refreshToken };
  }
  async registerCheckOTP(mobile, code,fullName,nationalCode) {
    const user = await this.#model.findOne({ mobile });
    if (user) throw new createHttpError.Unauthorized("کاربر وجود دارد");
    const otpcode = await redisClient.get(mobile)
    if (!otpcode)
        throw new createHttpError.Unauthorized(AuthMessages.OTPCodeExpired);
    if (otpcode !== code)
        throw new createHttpError.Unauthorized(AuthMessages.OTPCodeInCorrect);
    const newUser = await this.#model.create({mobile,fullName,nationalCode})
    const wallet = await findWalletByUserId(newUser?._id);
    if (isFalse(wallet)) await createWallet(newUser._id);
    const walletnew = await findWalletByUserId(newUser?._id);
    if (isFalse(walletnew)){
      await this.#model.deleteOne({_id: newUser._id})
      throw createHttpError.BadRequest();
    } 
    const accessToken = this.signAccessToken({ mobile, userId: newUser._id });
    const refreshToken = this.signRefreshToken({ mobile, userId: newUser._id });
    return { accessToken, refreshToken };
  }
  async signToken(payload) {
    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);
    return { accessToken, refreshToken };
  }
  async checkExistUserByMobile(mobile) {
    const user = await this.#model.findOne({ mobile });
    if (!user) throw new createHttpError.NotFound(AuthMessages.NotFound);
    return user;
  }
  signAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
  }
  signRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESHSECRET_KEY, {
      expiresIn: "1d",
    });
  }
  async verifyRefreshToken(token) {
    const jwtr = jwt.verify(
        token,
        process.env.JWT_REFRESHSECRET_KEY)
    const block = await redisClient.get(jwtr?.userId);
    if(block) throw new createHttpError.Unauthorized();
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        process.env.JWT_REFRESHSECRET_KEY,
        async (err, payload) => {
          if (err)
            return reject(
              createHttpError.Unauthorized(AuthMessages.TokenIsInvalid)
            );
          const { mobile, userId } = payload || {};
          const user = await UserModel.findOne(
            { mobile },
            {
              accessToken: 0,
              otp: 0,
              updatedAt: 0,
              createdAt: 0,
              verfiedMobile: 0,
              _id: 0,
            }
          ).lean();
          if (!user)
            throw new createHttpError.Unauthorized(AuthMessages.NotFound);
          resolve({ mobile, userId });
        }
      );
    });
  }
}

module.exports = new AuthService();
