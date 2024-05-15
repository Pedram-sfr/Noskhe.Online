const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true },
    nationalCode: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
  },
  { timestamps: true, versionKey: 0 }
);

const UserModel = model("user", UserSchema);
module.exports = UserModel;
