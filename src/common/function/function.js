const fs = require("fs");
const moment = require("jalali-moment");
const path = require("path")
const ejs = require("ejs");
const puppeteer = require("puppeteer");
const { randomInt } = require("crypto");

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
function dateToJalali(data) {
  const d = data.toString().split("T")[0].split(" ")
  const date = moment(data).locale('fa').format('YYYY MMMM DD');
  const time = moment(data).locale('fa').format('HH:mm')
  return {date,time}
}
function codeGen() {
  return Math.floor(new Date().valueOf()*randomInt(100,999))
}

function createPdf(factor) {
  const templateFile = path.resolve(__dirname, "../../../views/invoice.ejs");
  ejs.renderFile(templateFile, {factor}, async function (err, html) {
    if (err) {
      console.log(err);
    }

    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.setContent(html);
    const date = new Date().getTime();
    await page.pdf({
      path: `./public/factor/${date}.pdf`,
      width: "8cm",
      height: undefined
    });
    await browser.close();
  });
}
module.exports ={
    isTrue,
    isFalse,
    deleteFileInPublic,
    deleteNulishObject,
    excelToArray,
    dateToJalali,
    createPdf,
    codeGen
}