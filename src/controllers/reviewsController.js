import db from "../config/db/queries.js";


const getAllPublishedReviews = async (req, res, next) => {
    try {
        const reviews = await db.getAllPublishedReviews();
        res.status(200).json({
            count: reviews.length,
            reviews,
        });
    } catch (err) {
        next(err);
    }
};

const getPublishedReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const review = await db.getPublishedReviewDetails(id);

        if (!review) return res.status(404).json({ error: "Review not found" });

        const comments = await db.getPublishedReviewComments(id);

        res.status(200).json({
            review,
            comments,
        });
    } catch (err) {
        next(arr);
    }
};

export default {
    getAllPublishedReviews,
    getPublishedReview
};