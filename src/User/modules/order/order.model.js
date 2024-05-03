const { Schema, model, Types } = require("mongoose");

const OTCSchema = new Schema({
    type: {type: String,required: true},
    count: {type: Number,required: true},
    image: {type: String, required: true},
    drugName: {type: String, required: true},
},{
    timestamps: true,
    versionKey: false,
    toJSON:{
        virtuals: true
    }
})

const ElecPrescriptionSchema = new Schema({
    typeOfInsurance: {type: String,required: true},
    nationalCode: {type: String,required: true},
    doctorName: {type: String,required: true},
    trackingCode: {type: String, required: true},
},{
    timestamps: true,
    versionKey: false,
    toJSON:{
        virtuals: true
    }
})
const UploadPrescriptionSchema = new Schema({
    image: {type: String, required: true},
},{
    timestamps: true,
    versionKey: false,
    toJSON:{
        virtuals: true
    }
})
OTCSchema.virtual("imageUrl").get(function(){
    return `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${this.image}`
})
UploadPrescriptionSchema.virtual("imageUrl").get(function(){
    return `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${this.image}`
})
const OrderSchema = new Schema({
    userId : {type: Types.ObjectId, ref: "user", required: true},
    mobile: {type: String,required: true},
    pharmId : {type: Types.ObjectId, required: false},
    addressId : {type: Types.ObjectId,ref: "address", required: true},
    description: {type: String, required: false},
    status: {type: String, required: false},
    otc: {type: [OTCSchema],required: false},
    uploadPrescription: {type: [UploadPrescriptionSchema],required: false},
    elecPrescription: {type: [ElecPrescriptionSchema],required: false},
},{timestamps: true,versionKey:0})

const OrderModel = model("order",OrderSchema);
module.exports = OrderModel