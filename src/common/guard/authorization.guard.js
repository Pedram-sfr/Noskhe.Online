const createHttpError = require("http-errors")
const AuthMessages = require("../messages/auth.messages")
const jwt = require("jsonwebtoken");
const UserModel = require("../../User/modules/user/user.model");
require("dotenv").config();
const Authorization = async (req,res,next)=>{
    try {
        const headers = req.headers;
        const [bearer, token] = headers?.["authorization"]?.split(" ") || [];
        if(token && ["bearer","Bearer"].includes(bearer)){
            jwt.verify(token,process.env.JWT_SECRET_KEY,async (err,payload)=>{
                if(err) return next(createHttpError.Unauthorized(AuthMessages.TokenIsInvalid))
                const {mobile,userId} = payload;
                const user = await UserModel.findOne({mobile}, {accessToken: 0, otp: 0, updatedAt: 0,createdAt: 0, verfiedMobile: 0,_id: 0}).lean();
                if(!user) throw new createHttpError.Unauthorized(AuthMessages.NotFoundUser);
                req.user ={mobile,userId};
                return next();
            })
        }
        else return next(createHttpError.Unauthorized(AuthMessages.TokenIsInvalid));
    } catch (error) {
        next(error)
    }
}

module.exports = Authorization