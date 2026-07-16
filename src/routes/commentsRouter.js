import { Router } from "express";
import commentsController from "../controllers/commentsController.js";
import passport from "passport";
import { requireAdmin } from "../config/middleware/auth.js";

const commentsRouter = Router();

commentsRouter.get("/", passport.authenticate("jwt", { session: false }), requireAdmin, commentsController.getComments);
commentsRouter.delete("/:id", passport.authenticate("jwt", { session: false }), requireAdmin, commentsController.deleteComment);

export default commentsRouter;