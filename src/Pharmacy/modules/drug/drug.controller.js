const { model, default: mongoose } = require("mongoose");
const DrugService = require("./drug.service")
const path = require("path")
const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const { deleteNulishObject, excelToArray, deleteFileInPublic, deleteFileInPublicAWS } = require("../../../common/function/function");
const xlsx = require("xlsx")
class DrugController{
    #service
    constructor(){
        autoBind(this);
        this.#service = DrugService
    }
    async addDrug(req,res,next){
        try {
            const {userId} = req.pharmacyuser
            const drugobj = req.body;
            const drug = await this.#service.findDrug(userId)
            if(drug) await this.#service.removeDrugList(userId);
            req.body.excelFile = (path.join(drugobj.fileUploadPath,drugobj.filename)).replace(/\\/gi,"/");
            const {excelFile} = req.body
            const file = xlsx.readFile(`public/${excelFile}`);
            const excel = Object.entries(file.Sheets.Sheet1)
            const data = excelToArray(excel)
            await this.#service.addDrug(userId,data)
            deleteFileInPublic(req.body.excelFile)
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: "با موفقیت افزوده شد"
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
    async drugList(req,res,next){
        try {
            const {userId} = req.pharmacyuser
            const {search} = req.query
            const data = await this.#service.findDrugList(userId)
            let drugs = []
            if(search){
                for(var i=0; i<data.length; i++) {
                    if(data[i]['drugName'].indexOf(search)!=-1) {
                        drugs.push(data[i]);
                    }
                }
            }else drugs = data;
            return res.status(200).json({
                statusCode: 200,
                data: {
                   drugs
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new DrugController();