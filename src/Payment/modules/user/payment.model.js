const { Schema, model, Types } = require("mongoose");

const PaymentSchema = new Schema(
  {
    userId: { type: Types.ObjectId,ref: "user", required: true },
    ref_id: { type: Number, required: true },
    amount: { type: Number, required: true },
    card_pan: { type: String, required: true },
    invoiceId: { type: Number, required: true },
    deliveryTo: { type: String, required: true },
    deliveryType: { type: String,enum: ['PERSON','COURIER'],default: 'COURIER', required: true },
    deliveryTime: {type: String,required: true},
    deliveryDate: {type: String,required: true},
    deliveryCode: {type: Number,required: true},
    trackingCode: {type: Number,required: true,unique: true},
  },
  { timestamps: true, versionKey: 0 }
);

const PaymentModel = model("payment", PaymentSchema);
module.exports = PaymentModel;
