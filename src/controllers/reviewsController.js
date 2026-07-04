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

export default {
    getAllPublishedReviews
};