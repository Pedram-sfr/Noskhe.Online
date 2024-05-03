const { Router } = require("express");
const { AuthRouter } = require("./modules/auth/auth.routes");
const {  UserARouter } = require("./modules/user/user.routes");
const { OrderRouter } = require("./modules/order/order.routes");
const { AddressRouter } = require("./modules/address/address.routes");

const userRouter = Router();

userRouter.use("/user/auth",AuthRouter);
userRouter.use("/user",UserARouter);
userRouter.use("/user/order",OrderRouter);
userRouter.use("/user/address",AddressRouter);

module.exports = userRouter;