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

const postCreateReview = async (req, res, next) => {
    try {
        const { 
            demographicId, 
            mediaTypeId, 
            genreIds, 
            title, 
            score, 
            body, 
            coverImageUrl,
        } = req.body;

        if (!title || !body || !mediaTypeId || !Array.isArray(genreIds) || genreIds.length === 0) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const userId = req.user.user_id;

        const review = await db.postCreateNewReview({
            userId, demographicId, mediaTypeId, genreIds, title, score, body, coverImageUrl,
        });

        res.status(201).json({ review });
    } catch (err) {
        next(err);
    }
};

const patchReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { 
            demographicId, 
            mediaTypeId, 
            genreIds, 
            title, 
            score, 
            body, 
            coverImageUrl,
            published
        } = req.body;

        if (!title || !body || !mediaTypeId || !Array.isArray(genreIds) || genreIds.length === 0) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const review = await db.patchExistingReview(id, {
            demographicId, mediaTypeId, title, score, body, coverImageUrl, published, genreIds,
        });

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        res.status(200).json({ review });
    } catch (err) {
        next(err);
    }
};

const deleteReview = async (req, res, next) => {

    try {
        const { id } = req.params;
        const rowCount = await db.deleteExistingReview(id);

        if (rowCount === 0) {
            return res.status(404).json({ error: "Review not found" });
        }

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

const deleteComment = async (req, res, next) => {

    try {
        const { id } = req.params;
        const rowCount = await db.deleteExistingComment(id);

        if (rowCount === 0) {
            return res.status(404).json({ error: "Comment not found" });
        }

        res.status(204).send();
    } catch (err) {
        next(err);
    }
};


export default {
    getAllPublishedReviews,
    getPublishedReview,
    postCreateReview,
    patchReview,
    deleteReview
};