const { Schema, model, Types } = require("mongoose");

const DrugSchema = new Schema({
    drugName: {type: String,required: true},
    drugType: {type: String,required: true},
    price: {type: Number, required: true},
    patient: {type: Number, required: true},
    insurance: {type: Number, required: true},
    count: {type: Number, required: true},
    total: {type: Number, required: true},
},{
    versionKey: false,
})
const FactorSchema = new Schema({
    pharmacyId: {type: Types.ObjectId,required: true,ref: "pharmacyUser"},
    userId: {type: Types.ObjectId,required: true,ref: "user"},
    orderId: {type: Types.ObjectId,required: true,ref: "order"},
    addressId: {type: Types.ObjectId,required: true,ref: "address"},
    totalPrice: {type: Number,required: true},
    shippingCost: {type: Number,required: true, default: 0},
    paymentCode: {type: Types.ObjectId,required: false},
    paymentStatus: {type: Boolean,required: true,default: false},
    sendStatus: {type: Boolean,required: true,default: false},
    drugs: {type: [DrugSchema],required: true},
},{timestamps: true,
    versionKey:0,
})
const FactorModel = model("factor",FactorSchema);
module.exports = FactorModel