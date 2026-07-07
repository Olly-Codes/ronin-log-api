import { Router } from "express";
import mediaTypesController from "../controllers/mediaTypesController.js";

const mediaTypesRouter = Router();

mediaTypesRouter.get("/", mediaTypesController.getMediaTypes);

export default mediaTypesRouter;