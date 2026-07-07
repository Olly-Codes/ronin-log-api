import db from "../config/db/queries.js";

const getGenres = async (req, res, next) => {

    try {
        const genres = await db.getGenres();
        res.status(200).json({
            count: genres.length,
            genres
        });
    } catch (err) {
        next(err);
    }
};

export default {
    getGenres
}