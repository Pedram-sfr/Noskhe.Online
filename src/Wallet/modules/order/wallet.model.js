const { Schema, model, Types } = require("mongoose");

const DetailSchema = new Schema({
    RefNo: {type: Number,required: true,unique: true},
    amount: {type: Number,required: true},
    paymentId: {type: Types.ObjectId, ref: "payment",required: true},
    invoiceId: {type: Types.ObjectId, ref: "factor",required: true},
    state: {type: String,enum: ['INCREMENT','DECREMENT','BUY'],required: true},
    description: {type: String,required: true},
    status: {type: Boolean,required: true},
},{
    versionKey: false,
    timestamps: true
})
const WalletSchema = new Schema({
    userId : {type: Types.ObjectId, ref: "user" || "pharmacyUser", required: true,unique: true},
    cash: {type: Number,required: true,default: 0},
    shebaNum: {type: String,required: true, default: ""},
    shebaName: {type: String,required: true, default: ""},
    detail: {type: [DetailSchema],required: false},
},{timestamps: true,versionKey:0,toJSON:{
    virtuals: true
}})

const WalletModel = model("wallet",WalletSchema);
module.exports = WalletModel