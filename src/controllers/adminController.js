import db from "../config/db/queries.js";

const getAllReviews = async (req, res, next) => {

    try {
        const reviews = await db.getAllReviews();
        
        if (reviews) {
            res.status(200).json(
                {
                    count: reviews.length,
                    reviews
                }
            );
        }
    } catch (err) {
        next(err);
    }
}