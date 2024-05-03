const { Schema, model, Types } = require("mongoose");

const AddressSchema = new Schema({
    userId : {type: Types.ObjectId, ref: "user", required: true},
    province : {type: String, required: false},
    city : {type: String, required: false},
    district : {type: String, required: false},
    address : {type: String, required: false},
    coordinate : {type: [Number], required: true},
    fullName: {type: String,required: false},
    mobile: {type: String,required: false},
},{timestamps: true,versionKey:0})

const AddressModel = model("address",AddressSchema);
module.exports = AddressModel