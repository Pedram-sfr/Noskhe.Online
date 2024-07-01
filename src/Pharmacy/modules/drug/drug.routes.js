
const AuthorizationPharmacy = require("../../../common/guard/authorizationPharmacy.guard");
const { uploadExcel, uploadexcel } = require("../../../common/utils/multer");
const DrugController = require("./drug.controller");

const router = require("express").Router();

router.post("/add-drug",uploadexcel.single("excelFile"),AuthorizationPharmacy,DrugController.addDrug)
router.get("/drogList",AuthorizationPharmacy,DrugController.drugList)
module.exports = {
    DrugRouter: router
}