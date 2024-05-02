const NodeEnv = require("../../../common/constant/env.enum");
const { AuthMessages } = require("./auth.messages");
const authService = require("./auth.service")
const autoBind = require("auto-bind");
const CookieName = require("../../../common/constant/cookie.enum");
const { sendOTPSchema, checkOTPSchema } = require("../../validator/auth.schema");
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
            const user = await this.#service.sendOTP(mobile)
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: AuthMessages.SendOTPSuccessfully,
                    code: user.otp.code
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
            return res.cookie(CookieName.AccessToken,token,{
                httpOnly: true,
                secure: process.env.NODE_ENV === NodeEnv.Development
            }).status(200).json({
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
            const mobile = await this.#service.verifyRefreshToken(refreshToken);
            const token = await this.#service.signToken({mobile});
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
            return res.clearCookie(CookieName.AccessToken).status(200).json({
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