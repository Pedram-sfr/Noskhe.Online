const fs = require("fs");
const path = require("path")

const isTrue = (value) => ["true",1,true].includes(value);
const isFalse = (value) => ["false",0,false].includes(value);
function deleteFileInPublic(fileAddress) {
    if (fileAddress) {
      const pathFile = path.join(__dirname, "..","..", "..", "public", fileAddress);
      if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile);
    }
  }
function deleteNulishObject(data) {
  let nullishData = ["", " ", "0", 0, null, undefined];
  Object.keys(data).forEach((key) => {
      if (nullishData.includes(data[key])) delete data[key];
  });
}

function excelToArray(excel) {
  let data = []
  let exobj = {}
  let j = 1;
  for (let i = 1; i < excel.length; i++) {
      if(`A${j}` == excel[i][0]) exobj["drugName"] = excel[i][1]["v"]
      else if(`B${j}` == excel[i][0]) exobj["drugType"] = excel[i][1]["v"]
      else if(`C${j}` == excel[i][0]) exobj["price"] = excel[i][1]["v"]
      else if(`D${j}` == excel[i][0]) exobj["patient"] = excel[i][1]["v"]
      else if(`E${j}` == excel[i][0]) exobj["insurance"] = excel[i][1]["v"]
      if(i%5 == 0) {
          data.push(exobj)
          exobj = {}
          j++;
      }
  }

  return data
}
module.exports ={
    isTrue,
    isFalse,
    deleteFileInPublic,
    deleteNulishObject,
    excelToArray,
}