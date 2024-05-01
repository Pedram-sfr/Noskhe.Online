const { Router } = require("express");
const { AuthRouter } = require("./modules/auth/auth.routes");
const {  UserARouter } = require("./modules/user/user.routes");

const userRouter = Router();

userRouter.use("/user/auth",AuthRouter);
userRouter.use("/user",UserARouter);

module.exports = userRouter;