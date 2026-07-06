import { Router } from "express";
import reviewsController from "../controllers/reviewsController.js";
import commentsController from "../controllers/commentsController.js";

const reviewsRouter = Router();

reviewsRouter.get("/", reviewsController.getAllPublishedReviews);
reviewsRouter.get("/:id", reviewsController.getPublishedReview);

reviewsRouter.post("/", reviewsController.postCreateReview);
reviewsRouter.post("/:id/comments", commentsController.postCreateComment);

reviewsRouter.patch("/:id", reviewsController.patchReview);

export default reviewsRouter;