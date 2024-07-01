const { Schema, model, Types } = require("mongoose");

const PharmacyOrderSchema = new Schema({
    refId: {type: Number,required: true},
    pharmacyId : {type: Types.ObjectId, ref: "pharmacyUser", required: true},
    orderId : {type: Types.ObjectId, ref: "order", required: true},
    status: {type: String, required: true,enum: ['WAITING','PENDING'],default: 'PENDING'},
    priority : {type: [Types.ObjectId], ref: "pharmacyUser", required: false},
},{timestamps: true,versionKey:0})

const PharmacyOrderModel = model("pharmacyOrder",PharmacyOrderSchema);
module.exports = PharmacyOrderModel