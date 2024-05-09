const { Schema, model } = require("mongoose");

const PharmacyUserSchema = new Schema({
    pharmacyName: {type: String,required: false},
    fullName: {type: String,required: false},
    nationalCode: {type: String,required: false},
    licenseNumber : {type: String, required: false},
    mobile: {type: String,required: true, unique: true},
    userName: {type: String,required: true, unique: true},
    password: {type: String,required: true},
    province : {type: String, required: false},
    city : {type: String, required: false},
    district : {type: String, required: false},
    address : {type: String, required: false},
    lat : {type: Number, required: false},
    lng : {type: Number, required: false},
},{timestamps: true,versionKey:0})

const PharmacyUserModel = model("pharmacyUser",PharmacyUserSchema);
module.exports = PharmacyUserModel