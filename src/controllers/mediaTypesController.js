import db from "../config/db/queries.js";

const getMediaTypes = async (req, res, next) => {

    try {
        const mediaTypes = await db.getMediaTypes();
        res.status(200).json({
            count: mediaTypes.length,
            mediaTypes
        });
    } catch (err) {
        next(err);
    }
};

export default {
    getMediaTypes
}