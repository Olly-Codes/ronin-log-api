import { Router } from "express";
import reviewsController from "../controllers/reviewsController.js";

const reviewsRouter = Router();

reviewsRouter.get("/", reviewsController.getAllPublishedReviews);

export default reviewsRouter;