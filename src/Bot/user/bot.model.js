const { Schema, model, Types } = require("mongoose");

const BotSchema = new Schema({
    pharmacyId: { type: Types.ObjectId, required: true, ref: "pharmacyUser"},
    chat_id: {type: Number,required: true,unique: true},
    userName: {type: String,required: false},
},{timestamps: true,versionKey:0})
const BotModel = model("bot",BotSchema);
module.exports = BotModel