const autoBind = require("auto-bind");
const UserModel = require("../user/user.model");
const createHttpError = require("http-errors");
const { AuthMessages } = require("./auth.messages");
const {randomInt} = require("crypto")
const jwt = require("jsonwebtoken");
const { resolve } = require("path");
const { rejects } = require("assert");
const { findWalletByUserId, createWallet } = require("../../../Wallet/modules/order/wallet.service");
const { isFalse } = require("../../../common/function/function");

class AuthService{
    #model;
    constructor(){
        autoBind(this);
        this.#model = UserModel
    }
    async sendOTP(mobile){
        const user = await this.#model.findOne({mobile});
        const now = new Date().getTime();
        const wallet = await findWalletByUserId(user?._id)
        const otp = {
            code : randomInt(10000,99999),
            expiresIn : now + (1000*60*2)
        }
        if(!user){
            const newUser = await this.#model.create({mobile,otp})
            if(isFalse(wallet)) await createWallet(newUser._id)
            return newUser
        }
        if(user.otp && user.otp.expiresIn > now) throw new createHttpError.BadRequest(AuthMessages.OTPCodeNotExpired)
        user.otp = otp;
        await user.save();
        return user;
    }
    async checkOTP(mobile,code){
        const user =await this.checkExistUserByMobile(mobile);
        const now = new Date().getTime();
        if(user?.otp?.expiresIn < now) throw new createHttpError.Unauthorized(AuthMessages.OTPCodeExpired);
        if(user?.otp?.code !== code) throw new createHttpError.Unauthorized(AuthMessages.OTPCodeInCorrect);
        if(!user.verfiedMobile){
            user.verfiedMobile = true;
        }
        const accessToken = this.signAccessToken({mobile,userId: user._id});
        const refreshToken = this.signRefreshToken({mobile,userId: user._id});
        await user.save();
        return {accessToken , refreshToken};
    }
    async signToken(payload){
        const accessToken = this.signAccessToken(payload);
        const refreshToken = this.signRefreshToken(payload);
        return {accessToken , refreshToken};
    }
    async checkExistUserByMobile(mobile){
        const user = await this.#model.findOne({mobile});
        if(!user) throw new createHttpError.NotFound(AuthMessages.NotFound);
        return user;
        
    }
    signAccessToken(payload){
        return jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn: "1d"});
    }
    signRefreshToken(payload){
        return jwt.sign(payload,process.env.JWT_REFRESHSECRET_KEY,{expiresIn: "1d"});
    }
    async verifyRefreshToken(token){
        return new Promise((resolve,reject) => {
            jwt.verify(token,process.env.JWT_REFRESHSECRET_KEY,async (err,payload)=>{
                if(err) return reject(createHttpError.Unauthorized(AuthMessages.TokenIsInvalid))
                const {mobile,userId} = payload || {};
                const user = await UserModel.findOne({mobile}, {accessToken: 0, otp: 0, updatedAt: 0,createdAt: 0, verfiedMobile: 0,_id: 0}).lean();
                if(!user) throw new createHttpError.Unauthorized(AuthMessages.NotFound);
                resolve({mobile,userId})
            })
        })

    }
}

module.exports = new AuthService();
