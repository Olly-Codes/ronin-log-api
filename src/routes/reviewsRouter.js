import { Router } from "express";
import reviewsController from "../controllers/reviewsController.js";

const reviewsRouter = Router();

reviewsRouter.get("/", reviewsController.getAllPublishedReviews);
reviewsRouter.get("/:id", reviewsController.getPublishedReview);

reviewsRouter.post("/", reviewsController.postCreateReview);

reviewsRouter.patch("/:id", reviewsController.patchReview);

export default reviewsRouter;