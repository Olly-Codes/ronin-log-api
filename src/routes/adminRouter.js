import { Router } from "express";
import adminController from "../controllers/adminController.js";
import passport from "passport";
import { requireAdmin } from "../config/middleware/auth.js";

const adminRouter = Router();

adminRouter.get("/reviews", passport.authenticate("jwt", { session: false }), requireAdmin, adminController.getAllReviews);
adminRouter.get("/users", passport.authenticate("jwt", { session: false }), requireAdmin, adminController.getUsers)

export default adminRouter;