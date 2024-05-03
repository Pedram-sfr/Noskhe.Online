const { Schema, model } = require("mongoose");

const OTPSchema = new Schema({
    code: {type: String,required: false,default: undefined},
    expiresIn: {type: Number,required: false, default: 0},
})
const OrderSchema = new Schema({
    fullName: {type: String,required: false},
    nationalCode: {type: String,required: false},
    mobile: {type: String,required: true, unique: true},
    otp: {type: OTPSchema},
    verfiedMobile: {type: Boolean,required: true, default: false},
},{timestamps: true,versionKey:0})

const OrderModel = model("order",OrderSchema);
module.exports = OrderModel