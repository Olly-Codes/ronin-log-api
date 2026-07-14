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

export default {
    getAllReviews,
    getUsers
}