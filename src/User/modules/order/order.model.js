const { Schema, model, Types } = require("mongoose");

const OTCSchema = new Schema({
    type: {type: String,required: false,enum:["CAPSULE","TAB","CAPSULE_PACKAGE","TAB_PACKAGE","DROPLET","OINTMENT","DRING","OTHER"]},
    count: {type: Number,required: true},
    image: {type: String, required: false},
    drugName: {type: String, required: false},
},{
    versionKey: false,
    toJSON:{
        virtuals: true
    }
})

const ElecPrescriptionSchema = new Schema({
    typeOfInsurance: {type: String,required: true,enum:["TAMIN","SALAMAT"]},
    nationalCode: {type: String,required: true},
    doctorName: {type: String,required: true},
    trackingCode: {type: String, required: true},
},{
    versionKey: false,
    toJSON:{
        virtuals: true
    }
})
const UploadPrescriptionSchema = new Schema({
    image: {type: String, required: true},
},{
    versionKey: false,
    toJSON:{
        virtuals: true
    }
})
OTCSchema.virtual("imageUrl").get(function(){
    return `https://${process.env.LIARA_ENDPOINT}/${this.image}`
})
UploadPrescriptionSchema.virtual("imageUrl").get(function(){
    return `https://${process.env.LIARA_ENDPOINT}/${this.image}`
})
const OrderSchema = new Schema({
    refId: {type: Number,required: true},
    userId : {type: Types.ObjectId, ref: "user", required: true},
    mobile: {type: String,required: false},
    fullName: {type: String,required: false},
    pharmId : {type: Types.ObjectId, required: false,ref: "pharmacyUser"},
    addressId : {type: Types.ObjectId,ref: "address", required: true},
    description: {type: String, required: false},
    status: {type: String, required: false,enum: ['SUCCESS','PENDING','FAILED','PAID','DELIVERED'],default: 'PENDING'},
    deliveryType: {type: String, required: false,enum: ['COURIER','PERSON'],default: 'COURIER'},
    otc: {type: [OTCSchema],required: false},
    uploadPrescription: {type: [UploadPrescriptionSchema],required: false},
    elecPrescription: {type: [ElecPrescriptionSchema],required: false},
    accepted: {type: Boolean, required: true,default: false}
},{timestamps: true,versionKey:0,toJSON:{
    virtuals: true
}})
const OrderModel = model("order",OrderSchema);
module.exports = OrderModel