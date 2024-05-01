const createHttpError = require("http-errors")
const AuthMessages = require("../messages/auth.messages")
const jwt = require("jsonwebtoken");
const UserModel = require("../../User/modules/user/user.model");
require("dotenv").config();
const Authorization = async (req,res,next)=>{
    try {
        const token = req?.cookies?.access_token
        if(!token) throw new createHttpError.Unauthorized(AuthMessages.Login);
        const data = jwt.verify(token,process.env.JWT_SECRET_KEY)
        console.log(data);
        if(typeof data == "object" && data?.userId){
            
            const user = await UserModel.findById(data.userId, {accessToken: 0, otp: 0, updatedAt: 0, verfiedMobile: 0}).lean();
            if(!user) throw new createHttpError.Unauthorized(AuthMessages.NotFoundUser);
            req.user =user;
            return next();
        }
        throw new createHttpError.Unauthorized(AuthMessages.TokenIsInvalid);
    } catch (error) {
        next(error)
    }
}

module.exports = Authorization