import db from "../config/db/queries.js";
import { sortData } from "../utils/sortData.js";

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

    const { countOnly, publishedCount, unpublishedCount, sort } = req.query;

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

            if (sort) {
                const sortedReviews = sortData(reviews, sort.toLowerCase());
                return res.status(200).json(
                    {
                        count: sortedReviews.length,
                        sortedReviews
                    }
                );
            }

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

const getReviewbyId = async (req, res, next) => {

    const { id } = req.params;

    try {
        const review = await db.getReviewDetails(id);

        if (!review) return res.status(404).json({ error: "Review not found" });

        const comments = await db.getReviewComments(id);

        res.status(200).json({
            review,
            comments,
        });
    } catch (err) {
        next(err);
    }
}

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
        next(err);
    }
};

export default {
    getAllReviews,
    getReviewbyId,
    getUsers
}