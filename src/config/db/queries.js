import pool from "./pool.js";

const getAllReviews = async () => {
    const { rows } = await pool.query(`
        SELECT r.review_id, r.title, r.score, r.cover_image_url,
        r.published, r.created_at, d.name AS demographic,
        mt.name AS media_type, json_agg(g.name) AS genres
        FROM reviews r
        LEFT JOIN demographics d ON r.demographic_id = d.demographic_id
        LEFT JOIN media_type mt ON r.media_type_id = mt.media_type_id
        LEFT JOIN review_genres rg ON r.review_id = rg.review_id
        LEFT JOIN genres g ON rg.genre_id = g.genre_id
        GROUP BY r.review_id, d.name, mt.name
        ORDER BY r.created_at DESC;
    `);
    return rows;    
}

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

const getPublishedReviewDetails = async (reviewId) => {
    const { rows } = await pool.query(`
        SELECT r.review_id, r.title, r.body, r.score, r.cover_image_url,
        r.published, r.created_at, d.name AS demographic,
        mt.name AS media_type, json_agg(g.name) AS genres
        FROM reviews r
        LEFT JOIN demographics d ON r.demographic_id = d.demographic_id
        LEFT JOIN media_type mt ON r.media_type_id = mt.media_type_id
        LEFT JOIN review_genres rg ON r.review_id = rg.review_id
        LEFT JOIN genres g ON rg.genre_id = g.genre_id
        WHERE r.review_id = $1 AND r.published = true
        GROUP BY r.review_id, d.name, mt.name;`, [reviewId]
    );
    return rows[0];
}

const getPublishedReviewComments = async (reviewId) => {
    const { rows } = await pool.query(`
        SELECT c.comment_id, c.content, c.created_at, u.username
        FROM comments c
        JOIN users u ON c.user_id = u.user_id
        JOIN reviews r ON c.review_id = r.review_id
        WHERE c.review_id = $1 AND r.published = true
        ORDER BY c.created_at DESC;`, [reviewId]
    );
    return rows;
}

const postCreateNewReview = async ({
        userId,
        demographicId,
        mediaTypeId,
        title,
        score,
        body,
        coverImageUrl,
        genreIds
    }
) => {
    const client = await pool.connect();
    
    try {
        await client.query("BEGIN");

        const { rows } = await client.query(`
            INSERT INTO reviews (user_id, demographic_id, media_type_id, title, score, body, cover_image_url, published)
            VALUES ($1, $2, $3, $4, $5, $6, $7, false)
            RETURNING review_id, title, body, score, cover_image_url, published, created_at;
            `, [userId, demographicId, mediaTypeId, title, score, body, coverImageUrl]
        );
        const review = rows[0];

        for (const genreId of genreIds) {
            await client.query(`
                INSERT INTO review_genres (review_id, genre_id)
                VALUES ($1, $2);
                `, [review.review_id, genreId]
            );
        }

        await client.query("COMMIT");
        return review;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};

const patchExistingReview = async (
    reviewId, {
        demographicId,
        mediaTypeId,
        title,
        score,
        body,
        coverImageUrl,
        published,
        genreIds
    }) => {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const { rows } = await client.query(`
                UPDATE reviews
                SET demographic_id = $1, media_type_id = $2, title = $3,
                    score = $4, body = $5, cover_image_url = $6, published = $7,
                    updated_at = NOW()
                WHERE review_id = $8
                RETURNING review_id, title, body, score, cover_image_url, published, created_at;
                `, [demographicId, mediaTypeId, title, score, body, coverImageUrl, published, reviewId]
            );
            const review = rows[0];

            if (review.length === 0 || !review) {
                await client.query("ROLLBACK");
                return null;
            }

            await client.query(`
                DELETE FROM review_genres WHERE review_id = $1;
                `, [reviewId]
            );

            for (const genreId of genreIds) {
                await client.query(`
                    INSERT INTO review_genres (review_id, genre_id)
                    VALUES ($1, $2);
                    `, [reviewId, genreId]
                );
            }

            await client.query("COMMIT");
            return review;
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
};

export default {
    getAllReviews,
    getAllPublishedReviews,
    getPublishedReviewDetails,
    getPublishedReviewComments,
    postCreateNewReview,
    patchExistingReview
}