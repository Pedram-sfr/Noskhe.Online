const { Schema, model, Types } = require("mongoose");

const DrugListSchema = new Schema({
    drugName: {type: String,required: true},
    drugType: {type: String,required: true},
    price: {type: Number, required: true},
    patient: {type: Number, required: true},
    insurance: {type: Number, required: true},
},{
    versionKey: false,
})
const DrugSchema = new Schema({
    pharmacyId: {type: Types.ObjectId,required: true,unique: true},
    drugs: {type: [DrugListSchema],required: true},
},{timestamps: true,
    versionKey:0,
})
DrugListSchema.index({drugName: "text"})
const DrugModel = model("drug",DrugSchema);
module.exports = DrugModel