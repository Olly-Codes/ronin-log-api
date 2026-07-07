import db from "../config/db/queries.js";

const getDemographics = async (req, res, next) => {

    try {
        const demographics = await db.getDemographics();
        res.status(200).json({
            count: demographics.length,
            demographics
        });
    } catch (err) {
        next(err);
    }
};

export default {
    getDemographics
}