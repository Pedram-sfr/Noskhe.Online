const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const { PharmacyAuthMessages } = require("./pharmacyAuth.messages");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const PharmacyUserModel = require("../user/pharmacyUser.model");
const { isFalse } = require("../../../common/function/function");
const { createWallet, findWalletByUserId } = require("../../../Wallet/modules/order/wallet.service");

class PharmacyAuthService{
    #model;
    constructor(){
        autoBind(this);
        this.#model = PharmacyUserModel
    }
    async addPharmUser(mobile,userName,password){
        const user = await this.#model.findOne({mobile});
        const hashedPassword = await this.createHashPassword(password);
        if(user) throw new createHttpError.BadRequest(PharmacyAuthMessages.OTPCodeNotExpired)
        const newUser = await this.#model.create({mobile,userName,password: hashedPassword})
        if(isFalse(await findWalletByUserId(user?._id)))
            await createWallet(newUser._id);
        return newUser;
    }
    async login(userName,password){
        const user =await this.checkExistUserByUserName(userName);
        const compare = await this.compareHashPassword(password,user.password)
        if(isFalse(compare)) throw new createHttpError.Unauthorized(PharmacyAuthMessages.WrongPassword);
        const accessToken = this.signAccessToken({userName,userId: user._id});
        const refreshToken = this.signRefreshToken({userName,userId: user._id});
        return {accessToken , refreshToken};
    }
    async signToken(payload){
        const accessToken = this.signAccessToken(payload);
        const refreshToken = this.signRefreshToken(payload);
        return {accessToken , refreshToken};
    }
    async checkExistUserByUserName(userName){
        const user = await this.#model.findOne({userName});
        if(!user) throw new createHttpError.NotFound(PharmacyAuthMessages.NotFound);
        return user;
        
    }
    signAccessToken(payload){
        return jwt.sign(payload,process.env.JWT_SECRET_KEY_PHARM,{expiresIn: "1d"});
    }
    signRefreshToken(payload){
        return jwt.sign(payload,process.env.JWT_REFRESHSECRET_KEY_PHARM,{expiresIn: "1d"});
    }
    async verifyRefreshToken(token){
        return new Promise((resolve,reject) => {
            jwt.verify(token,process.env.JWT_REFRESHSECRET_KEY_PHARM,async (err,payload)=>{
                if(err) return reject(createHttpError.Unauthorized(PharmacyAuthMessages.TokenIsInvalid))
                const {userName,userId} = payload || {};
                const user = await this.#model.findOne({userName}, {accessToken: 0, otp: 0, updatedAt: 0,createdAt: 0, verfiedMobile: 0}).lean();
                if(!user) throw new createHttpError.Unauthorized(PharmacyAuthMessages.NotFound);
                resolve({userName,userId})
            })
        })

    }
    async createHashPassword(password){
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword
    }
    async compareHashPassword(password,userPassword){
        const passwordMatch = await bcrypt.compare(password, userPassword);
        return passwordMatch
    }
}

module.exports = new PharmacyAuthService();
