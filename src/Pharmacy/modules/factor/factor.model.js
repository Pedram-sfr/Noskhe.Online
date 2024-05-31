const { Schema, model, Types } = require("mongoose");

const DrugSchema = new Schema({
    drugId: {type: Types.ObjectId,required: true},
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
    invoiceId: {type: Number,required: true},
    pharmacyId: {type: Types.ObjectId,required: true,ref: "pharmacyUser"},
    userId: {type: Types.ObjectId,required: true,ref: "user"},
    orderId: {type: Types.ObjectId,required: true,ref: "order"},
    addressId: {type: Types.ObjectId,required: true,ref: "address"},
    price: {type: Number,required: true,default: 0},
    insurancePrice: {type: Number,required: true,default: 0},
    totalPrice: {type: Number,required: true,default: 0},
    deliveryTime: {type: Number,required: true,default: 60},
    deliveryType: {type: String, required: true,enum: ['COURIER','PERSON'],default: 'COURIER'},
    shippingCost: {type: Number,required: true, default: 0},
    paymentCode: {type: Types.ObjectId,ref: "payment",required: false},
    paymentStatus: {type: Boolean,required: true,default: false},
    sendStatus: {type: Boolean,required: true,default: false},
    active: {type: Boolean,required: true,default: true},
    drugs: {type: [DrugSchema],required: true},
    status: {type: String, required: true,enum: ['SENT','PENDING','FAILED','PAID','DELIVERED'],default: 'PENDING'},
},{timestamps: true,
    versionKey:0,
})
const FactorModel = model("factor",FactorSchema);
module.exports = FactorModel