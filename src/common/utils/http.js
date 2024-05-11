const { default: axios } = require("axios");

require("dotenv").config();
const getAddressDetail = async (lat, lng) => {
  const result = await axios
    .get(`${process.env.MAP_IR_URL}?lat=${lat}&lon=${lng}`, {
      headers: {
        "x-api-key": process.env.MAP_API_KEY,
      },
    })
    .then((res) => res.data);

  return {
      province: result.province,
      city: result.city,
      address: result.address_compact,
  };
};

const sendOTPSMS = async (Destination , P1) => {
  const result = await axios
    .get(`${process.env.SMS_URL}?ApiKey=${process.env.SMS_API_KEY}&TemplateKey=${process.env.SMS_TemplateKey_OTP}&Destination=${Destination}&P1=${P1}`)
    .then((res) => res.data);
  console.log(result);
  return {
      province: result.Success,
      city: result.ErrorCode,
      address: result.Status,
  };
};
const sendSMS = async (text,Recipients ) => {
  const result = await axios
    .get(`${process.env.SMS_URL_SEND}?ApiKey=${process.env.SMS_API_KEY}&Text=${text}&Sender=${process.env.SMS_SENDER}&Recipients=${Recipients}`)
    .then((res) => res.data);
  console.log(result);
  return {
      province: result.Success,
      city: result.ErrorCode,
      address: result.Status,
  };
};
module.exports= {
    getAddressDetail,sendOTPSMS,sendSMS
}
