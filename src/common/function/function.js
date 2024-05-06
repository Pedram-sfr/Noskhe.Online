const fs = require("fs");
const path = require("path")

const isTrue = (value) => ["true",1,true].includes(value);
const isFalse = (value) => ["false",0,false].includes(value);
function deleteFileInPublic(fileAddress) {
    if (fileAddress) {
      const pathFile = path.join(__dirname, "..", "..", "public", fileAddress);
      if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile);
    }
  }
function deleteNulishObject(data) {
  let nullishData = ["", " ", "0", 0, null, undefined];
  Object.keys(data).forEach((key) => {
      if (nullishData.includes(data[key])) delete data[key];
  });
}
module.exports ={
    isTrue,
    isFalse,
    deleteFileInPublic,
    deleteNulishObject
}