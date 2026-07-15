import db from "../config/db/queries.js";

const getUsers = async (req, res, next) => {

    try {
        const users = await db.getUsers();

        if (users) {
            res.status(200).json(
                {
                    count: users.length,
                    users
                }
            );
        }
    } catch (err) {
        next(err);
    }
};

const getAllReviews = async (req, res, next) => {

    const { countOnly, publishedCount, unpublishedCount} = req.query;

    try {
        if (countOnly) {
            const reviewsCount = await db.getReviewsCount();
            return res.status(200).json({ reviewsCount });
        } else if (publishedCount) {
            const published = await db.getPublishedReviewsCount();
            return res.status(200).json({ published });
        } else if (unpublishedCount) {
            const unpublished = await db.getUnPublishedReviewsCount();
            return res.status(200).json({ unpublished });
        }
        
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

export default {
    getAllReviews,
    getUsers
}