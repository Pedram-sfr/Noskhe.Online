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
module.exports ={
    isTrue,
    isFalse,
    deleteFileInPublic
}