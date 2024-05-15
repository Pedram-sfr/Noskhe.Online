const Joi = require("@hapi/joi");

const sendOTPSchema = Joi.object({
  mobile: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(new Error("شماره موبایل وارد شده صحیح نمیباشد")),
});
const checkOTPSchema = Joi.object({
  mobile: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(new Error("شماره موبایل وارد شده صحیح نمیباشد")),
  fullName: Joi.string().error(new Error(" نام وارد شده صحیح نمیباشد")),
  nationalCode: Joi.string()
    .length(10)
    .pattern(/^[0-9]{10}$/)
    .error(new Error("شماره ملی وارد شده صحیح نمیباشد")),
  code: Joi.string()
    .length(5)
    .error(new Error("فرمت کد ارسال شده صحیح نمیباشد")),
});

module.exports = {
  sendOTPSchema,
  checkOTPSchema,
};
