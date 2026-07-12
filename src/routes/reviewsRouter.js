import { Router } from "express";
import reviewsController from "../controllers/reviewsController.js";
import commentsController from "../controllers/commentsController.js";
import passport from "passport";
import { requireAdmin } from "../config/middleware/auth.js";

const reviewsRouter = Router();

reviewsRouter.get("/", reviewsController.getAllPublishedReviews);
reviewsRouter.get("/:id", reviewsController.getPublishedReview);

reviewsRouter.post("/", passport.authenticate("jwt", { session: false }), requireAdmin, reviewsController.postCreateReview);
reviewsRouter.post("/:id/comments", passport.authenticate("jwt", { session: false }), commentsController.postCreateComment);

reviewsRouter.patch("/:id", passport.authenticate("jwt", { session: false }), requireAdmin, reviewsController.patchReview);

reviewsRouter.delete("/:id", passport.authenticate("jwt", { session: false }), requireAdmin, reviewsController.deleteReview);

export default reviewsRouter;