import { Router } from "express";
import reviewsController from "../controllers/reviewsController.js";

const reviewsRouter = Router();

reviewsRouter.get("/", reviewsController.getAllPublishedReviews);
reviewsRouter.get("/details/:id", reviewsController.getPublishedReview);

reviewsRouter.post("/", reviewsController.postCreateReview);

export default reviewsRouter;