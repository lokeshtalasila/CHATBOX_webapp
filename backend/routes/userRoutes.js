import express from "express";
import userControllers from "../controllers/userControllers.js"
import { verifyUser } from "../middlewares/auth.js"

const userRouter = express.Router();

userRouter.get("/getuser/:id/:userid", verifyUser, userControllers.getUser);
userRouter.get("/searchuser/:id", verifyUser, userControllers.searchUser);
userRouter.post("/login", userControllers.login);
userRouter.post("/register", userControllers.register);

module.exports = userRouter;
