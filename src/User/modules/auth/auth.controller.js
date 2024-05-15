const NodeEnv = require("../../../common/constant/env.enum");
const { AuthMessages } = require("./auth.messages");
const authService = require("./auth.service")
const autoBind = require("auto-bind");
const CookieName = require("../../../common/constant/cookie.enum");
const { sendOTPSchema, checkOTPSchema } = require("../../validator/auth.schema");
const redisClient = require("../../../common/utils/initRedis");
class AuthController{
    #service
    constructor(){
        autoBind(this);
        this.#service = authService
    }
    async sendOTP(req,res,next){
        try {
            await sendOTPSchema.validateAsync(req.body)
            const {mobile} = req.body;
            const code = await this.#service.sendLoginOTP(mobile)
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: AuthMessages.SendOTPSuccessfully,
                    code
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async sendRegisterOTP(req,res,next){
        try {
            await sendOTPSchema.validateAsync(req.body)
            const {mobile} = req.body;
            const code = await this.#service.sendRegisterOTP(mobile)
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: AuthMessages.SendOTPSuccessfully,
                    code
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async checkOTP(req,res,next){
        try {
            await checkOTPSchema.validateAsync(req.body)
            const {mobile,code} = req.body;
            const token = await this.#service.checkOTP(mobile,code)
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: AuthMessages.LoginSuccessfully,
                    token
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async registerCheckOTP(req,res,next){
        try {
            await checkOTPSchema.validateAsync(req.body)
            const {mobile,code,fullName,nationalCode} = req.body;
            const token = await this.#service.registerCheckOTP(mobile,code,fullName,nationalCode)
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: AuthMessages.LoginSuccessfully,
                    token
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async refreshToken(req,res,next){
        try {
            const {refreshToken} = req.body;
            const {mobile,userId} = await this.#service.verifyRefreshToken(refreshToken);
            const token = await this.#service.signToken({mobile,userId});
            return res.status(200).json({
                statusCode: 200,
                data: {
                    token
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async logout(req,res,next){
        try {
            const {userId,token} = req.user;
            await redisClient.set(String(userId), token, { EX: (24*60*60) }, (err) => {
                if (err) return err.message;
            });
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: AuthMessages.Logout,
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AuthController();