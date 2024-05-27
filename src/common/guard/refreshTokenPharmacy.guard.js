const createHttpError = require("http-errors")
const AuthMessages = require("../messages/auth.messages")
const jwt = require("jsonwebtoken");
const PharmacyUserModel = require("../../Pharmacy/modules/user/pharmacyUser.model");
require("dotenv").config();
const RefreshTokenPharmacy = async (req,res,next)=>{
    try {
        const headers = req.headers;
        const [bearer, token] = headers?.["authorization"]?.split(" ") || [];
        if(token && ["bearer","Bearer"].includes(bearer)){
            jwt.verify(token,process.env.JWT_REFRESHSECRET_KEY_PHARM,async (err,payload)=>{
                if(err) return next(createHttpError.Unauthorized(AuthMessages.TokenIsInvalid))
                const {userName,userId} = payload;
                const user = await PharmacyUserModel.findOne({userName}, {accessToken: 0, otp: 0, updatedAt: 0,createdAt: 0, verfiedMobile: 0}).lean();
                if(!user) throw new createHttpError.Unauthorized(AuthMessages.NotFoundUser);
                req.pharmacyuser ={token,userId};
                return next();
            })
        }
        else return next(createHttpError.Unauthorized(AuthMessages.TokenIsInvalid));
    } catch (error) {
        next(error)
    }
}

module.exports = RefreshTokenPharmacy