const { Router } = require("express");
const { AuthRouter } = require("./User/modules/auth/auth.routes");
const {  UserARouter } = require("./User/modules/user/user.routes");
const { OrderRouter } = require("./User/modules/order/order.routes");
const { AddressRouter } = require("./User/modules/address/address.routes");
const { PharmacyAuthRouter } = require("./Pharmacy/modules/auth/pharmacyAuth.routes");
const { PharmacyUserRouter } = require("./Pharmacy/modules/user/pharmacyUser.routes");

const AllRouter = Router();

AllRouter.use("/user/auth",AuthRouter);
AllRouter.use("/user",UserARouter);
AllRouter.use("/user/order",OrderRouter);
AllRouter.use("/user/address",AddressRouter);

AllRouter.use("/pharmacy/auth",PharmacyAuthRouter);
AllRouter.use("/pharmacy",PharmacyUserRouter);


module.exports = AllRouter;
