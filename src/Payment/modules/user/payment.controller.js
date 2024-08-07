const { model, default: mongoose } = require("mongoose");
const PaymentService = require("./payment.service")
const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const FactorModel = require("../../../Pharmacy/modules/factor/factor.model");
const { randomInt } = require("crypto");
const moment = require("jalali-moment");
const { codeGen } = require("../../../common/function/function");
const AddressModel = require("../../../User/modules/address/address.model");
const PharmacyUserModel = require("../../../Pharmacy/modules/user/pharmacyUser.model");
const PaymentModel = require("./payment.model");
const OrderModel = require("../../../User/modules/order/order.model");
const { description } = require("@hapi/joi/lib/base");
const walletService = require("../../../Wallet/modules/order/wallet.service");
class PaymentController{
    #service
    #walletService
    constructor(){
        autoBind(this);
        this.#service = PaymentService
        this.#walletService = walletService
    }
    async payment(req,res,next){
        try {
            const { userId } = req.user;
            const { invoiceId } = req.body;
            const factor = await FactorModel.findOne({invoiceId,userId})
            if(!factor) throw createHttpError.NotFound();
            let data = {},detail = {}
            if(factor.paymentStatus == false){
                const now = new Date().getTime();
                const date = moment(now).locale("fa").format("YYYY/MM/DD dddd");
                // return console.log(date);
                const deliveryCode = randomInt(1000,9999);
                const trackingCode =  codeGen();
                const deliveryDate = date;
                let deliveryTime = "",deliveryTo = "";
                if(factor.deliveryType == 'COURIER'){
                    const timeh = parseInt(moment(now).add(1, "hours").locale("fa").format("HH"));
                    const timem = parseInt(moment(now).add(1, "hours").locale("fa").format("mm"));
                    const address = await AddressModel.findOne({_id: factor.addressId},{address: 1});
                    if(timem < 30)
                        deliveryTime = `${timeh} - ${timeh + 1}`;
                    else if(timem > 30)
                        deliveryTime = `${timeh}:30 - ${timeh + 1}:30`;
                    deliveryTo = address.address;
                }
                if(factor.deliveryType == 'PERSON'){
                    const time = moment(now + (factor.deliveryTime * 60000)).locale("fa").format("HH:mm");
                    const address = await PharmacyUserModel.findOne({_id: factor.pharmacyId},{address: 1})
                    deliveryTo = address.address
                    deliveryTime = time;
                }
                data = {ref_id: codeGen(),amount: factor.totalPrice + factor.shippingCost + 50000,card_pan: "621986******0105",userId,invoiceId,deliveryType: factor.deliveryType,deliveryCode,trackingCode,deliveryDate,deliveryTime,deliveryTo}
                const pay = await PaymentModel.create(data);
                factor.status = "PAID";
                factor.paymentStatus = true;
                factor.paymentCode = pay._id;
                factor.save();
                const order = await OrderModel.findOne({_id: factor.orderId});
                order.status = 'PAID';
                order.save();
                const pharmDetail = {
                    RefNo: pay.ref_id,
                    amount: pay.amount,
                    paymentId: pay._id,
                    invoiceId: factor._id,
                    state: 'INCREMENT',
                    status: true,
                    description: `واریز مبلغ سفارش به شماره فاکتور ${factor.invoiceId} `
                }
                await this.#walletService.addWalletDetail(factor.pharmacyId,pharmDetail)
                const userDetail = {
                    RefNo: pay.ref_id,
                    amount: pay.amount,
                    paymentId: pay._id,
                    invoiceId: factor._id,
                    state: 'BUY',
                    status: true,
                    description: `پرداخت مبلغ سفارش به شماره فاکتور ${factor.invoiceId} `
                }
                await this.#walletService.addWalletDetailForBuy(userId,userDetail)
            }else{
                throw createHttpError.BadRequest()
            }
            return res.status(200).json({
                statusCode: 200,
                data,
                error: null
            })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new PaymentController();