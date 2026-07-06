import { Router } from "express";
import commentsController from "../controllers/commentsController.js";

const commentsRouter = Router();

commentsRouter.delete("/:id", commentsController.deleteComment);

export default commentsRouter;