import pool from "./pool.js";

const getAllPublishedReviews = async () => {
    const { rows } = await pool.query(`
        SELECT r.review_id, r.title, r.score, r.cover_image_url,
        r.published, r.created_at, d.name AS demographic,
        mt.name AS media_type, json_agg(g.name) AS genres
        FROM reviews r
        LEFT JOIN demographics d ON r.demographic_id = d.demographic_id
        LEFT JOIN media_type mt ON r.media_type_id = mt.media_type_id
        LEFT JOIN review_genres rg ON r.review_id = rg.review_id
        LEFT JOIN genres g ON rg.genre_id = g.genre_id
        WHERE r.published = true
        GROUP BY r.review_id, d.name, mt.name
        ORDER BY r.created_at DESC;
    `);
    return rows;
}

export default {
    getAllPublishedReviews
}