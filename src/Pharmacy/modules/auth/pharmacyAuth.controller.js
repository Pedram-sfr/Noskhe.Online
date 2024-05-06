const NodeEnv = require("../../../common/constant/env.enum");
const { PharmacyAuthMessages } = require("./pharmacyAuth.messages");
const PharmacyAuthService = require("./pharmacyAuth.service")
const autoBind = require("auto-bind");
const CookieName = require("../../../common/constant/cookie.enum");
class PharmacyAuthController{
    #service
    constructor(){
        autoBind(this);
        this.#service = PharmacyAuthService
    }
    async register(req,res,next){
        try {
            const {mobile,userName,password} = req.body;
            const user = await this.#service.addPharmUser(mobile,userName,password)
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: PharmacyAuthMessages.Register,
                    user
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async login(req,res,next){
        try {
            const {userName,password} = req.body;
            const token = await this.#service.login(userName,password)
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: PharmacyAuthMessages.LoginSuccessfully,
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
            const {userName,userId} = await this.#service.verifyRefreshToken(refreshToken);
            console.log({userName,userId});
            const token = await this.#service.signToken({userName,userId});
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
            console.log(req.pharmacyuser);
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: PharmacyAuthMessages.Logout,
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new PharmacyAuthController();