import { Router } from "express";
import authController from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/register", authController.postRegister);
authRouter.post("/login", authController.postLogin);

export default authRouter;