const { Schema, model, Types } = require("mongoose");

const PharmacyOrderSchema = new Schema({
    pharmacyId : {type: Types.ObjectId, ref: "pharmacyUser", required: true},
    orderId : {type: Types.ObjectId, ref: "order", required: true},
    priority : {type: [Types.ObjectId], ref: "pharmacyUser", required: false},
},{timestamps: true,versionKey:0})

const PharmacyOrderModel = model("pharmacyOrder",PharmacyOrderSchema);
module.exports = PharmacyOrderModel