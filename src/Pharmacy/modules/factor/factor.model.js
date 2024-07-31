const { Schema, model, Types } = require("mongoose");
const OTCSchema = new Schema(
  {
    type: {
      type: String,
      required: false,
      enum: [
        "CAPSULE",
        "TAB",
        "CAPSULE_PACKAGE",
        "TAB_PACKAGE",
        "DROPLET",
        "OINTMENT",
        "DRING",
        "OTHER",
      ],
    },
    count: { type: Number, required: true },
    image: { type: String, required: false },
    drugName: { type: String, required: false },
    price: { type: Number, required: false },
    total: { type: Number, required: false },
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
  }
);

const ElecPrescriptionSchema = new Schema(
  {
    typeOfInsurance: {
      type: String,
      required: true,
      enum: ["TAMIN", "SALAMAT"],
    },
    nationalCode: { type: String, required: true },
    doctorName: { type: String, required: true },
    trackingCode: { type: String, required: true },
    price: { type: Number, required: false },
    patient: { type: Number, required: false },
    insurance: { type: Number, required: false },
    count: { type: Number, required: true, default: 1 },
    total: { type: Number, required: false },
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
  }
);
const UploadPrescriptionSchema = new Schema(
  {
    image: { type: String, required: true },
    price: { type: Number, required: false },
    patient: { type: Number, required: false },
    insurance: { type: Number, required: false },
    count: { type: Number, required: false, default: 1 },
    total: { type: Number, required: false },
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
  }
);
OTCSchema.virtual("imageUrl").get(function () {
  return `https://${process.env.LIARA_ENDPOINT}/${this.image}`;
});
UploadPrescriptionSchema.virtual("imageUrl").get(function () {
  return `https://${process.env.LIARA_ENDPOINT}/${this.image}`;
});
const FactorSchema = new Schema(
  {
    invoiceId: { type: Number, required: true },
    pharmacyId: { type: Types.ObjectId, required: true, ref: "pharmacyUser" },
    userId: { type: Types.ObjectId, required: true, ref: "user" },
    orderId: { type: Types.ObjectId, required: true, ref: "order" },
    addressId: { type: Types.ObjectId, required: true, ref: "address" },
    fullName: {type: String,required: false},
    price: { type: Number, required: true, default: 0 },
    insurancePrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    deliveryTime: { type: Date, required: true },
    deliveryType: {
      type: String,
      required: true,
      enum: ["COURIER", "PERSON"],
      default: "COURIER",
    },
    shippingCost: { type: Number, required: true, default: 0 },
    paymentCode: { type: Types.ObjectId, ref: "payment", required: false },
    paymentStatus: { type: Boolean, required: true, default: false },
    sendStatus: { type: Boolean, required: true, default: false },
    active: { type: Boolean, required: true, default: true },
    otc: { type: [OTCSchema], required: false },
    uploadPrescription: { type: [UploadPrescriptionSchema], required: false },
    elecPrescription: { type: [ElecPrescriptionSchema], required: false },
    status: {
      type: String,
      required: true,
      enum: ["SENT", "PENDING", "FAILED", "PAID", "DELIVERED","WFC","WFP"],
      default: "WFP",
    },
  },
  { timestamps: true, versionKey: 0 }
);
const FactorModel = model("factor", FactorSchema);
module.exports = FactorModel;
