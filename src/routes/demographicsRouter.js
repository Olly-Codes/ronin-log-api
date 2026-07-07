import { Router } from "express";
import demographicsController from "../controllers/demographicsController.js";

const demographicsRouter = Router();

demographicsRouter.get("/", demographicsController.getDemographics);

export default demographicsRouter;