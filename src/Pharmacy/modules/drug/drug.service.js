const autoBind = require("auto-bind");
const DrugModel = require("./drug.model");
const createHttpError = require("http-errors");
const { UserMessages } = require("./drug.messages");

class DrugService{
    #model;
    constructor(){
        autoBind(this);
        this.#model = DrugModel
    }
    
    async addDrug(pharmacyId,drugs){
        const drug = await this.#model.create({pharmacyId,drugs});
        return drug
    } 
    async findDrug(pharmacyId){
        const drug = await this.#model.findOne({pharmacyId})
        return drug
    } 
    async findDrugList(pharmacyId){
        
        const drug =  await this.#model.findOne({pharmacyId},{drugs: 1,_id: 0,})
        if(!drug) createHttpError.NotFound("یافت نشد")
        return drug.drugs
    } 
    async removeDrugList(pharmacyId){
        const drug = await this.#model.deleteOne({pharmacyId})
        return drug
    } 
    async editOneDrug(pharmacyId,drugId,data){
        const drug = await this.#model.updateOne(
            {pharmacyId,"drugs._id": drugId},
            {$set: {
                "drugs.$": data
            }})
        return drug
    } 

}


module.exports = new DrugService();
