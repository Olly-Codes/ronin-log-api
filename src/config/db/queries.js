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

const getUsers = async () => {
    const { rows } = await pool.query(`
        SELECT user_id, username, email, role
        FROM users;
        `
    );
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

const getReviewDetails = async (reviewId) => {
    const { rows } = await pool.query(`
        SELECT r.review_id, r.title, r.body, r.score, r.cover_image_url,
        r.published, r.created_at, r.updated_at, d.name AS demographic,
        mt.name AS media_type, json_agg(g.name) AS genres
        FROM reviews r
        LEFT JOIN demographics d ON r.demographic_id = d.demographic_id
        LEFT JOIN media_type mt ON r.media_type_id = mt.media_type_id
        LEFT JOIN review_genres rg ON r.review_id = rg.review_id
        LEFT JOIN genres g ON rg.genre_id = g.genre_id
        WHERE r.review_id = $1
        GROUP BY r.review_id, d.name, mt.name;`, [reviewId]
    );
    return rows[0];
};

const getPublishedReviewDetails = async (reviewId) => {
    const { rows } = await pool.query(`
        SELECT r.review_id, r.title, r.body, r.score, r.cover_image_url,
        r.published, r.created_at, r.updated_at, d.name AS demographic,
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

const getReviewsCount = async () => {
    const { rows } = await pool.query(`
        SELECT COUNT(*)
        FROM reviews;
        `
    );
    return rows[0];
}

const getPublishedReviewsCount = async () => {
    const { rows } = await pool.query(`
        SELECT COUNT(*)
        FROM reviews
        WHERE published = true;
        `
    );
    return rows[0];
}

const getUnPublishedReviewsCount = async () => {
    const { rows } = await pool.query(`
        SELECT COUNT(*)
        FROM reviews
        WHERE published = false;
        `
    );
    return rows[0];
}

const getGenres = async () => {
    const { rows } = await pool.query(`
        SELECT *
        FROM genres;
        `);
    return rows;
};

const getDemographics = async () => {
    const { rows } = await pool.query(`
        SELECT *
        FROM demographics;
        `);
    return rows;
};

const getMediaTypes = async () => {
    const { rows } = await pool.query(`
        SELECT *
        FROM media_type;
        `);
    return rows;
};

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
    let reviewId;
    
    try {
        await client.query("BEGIN");

        const { rows } = await client.query(`
            INSERT INTO reviews (user_id, demographic_id, media_type_id, title, score, body, cover_image_url, published)
            VALUES ($1, $2, $3, $4, $5, $6, $7, false)
            RETURNING review_id;
            `, [userId, demographicId, mediaTypeId, title, score, body, coverImageUrl]
        );
        reviewId = rows[0].review_id;

        for (const genreId of genreIds) {
            await client.query(`
                INSERT INTO review_genres (review_id, genre_id)
                VALUES ($1, $2);
                `, [reviewId, genreId]
            );
        }

        await client.query("COMMIT");
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }

    return getReviewDetails(reviewId);
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
                RETURNING review_id;
                `, [demographicId, mediaTypeId, title, score, body, coverImageUrl, published, reviewId]
            );

            if (rows.length === 0 || !rows) {
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
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }

        return getReviewDetails(reviewId);
};

const postCreateNewComment = async (reviewId, userId, content) => {
    const { rows } = await pool.query(`
        INSERT INTO comments (review_id, user_id, content)
        VALUES ($1, $2, $3)
        RETURNING comment_id, content, created_at;
        `, [reviewId, userId, content]
    );
    
    return rows[0];
}

const getCommentsCount = async () => {
    const { rows } = await pool.query(`
        SELECT COUNT(*)
        FROM comments;
        `
    );
    return rows[0];
}

const deleteExistingReview = async (reviewId) => {
    const { rowCount } = await pool.query(`
        DELETE FROM reviews
        WHERE review_id = $1;
        `, [reviewId]);
    return rowCount;
};

const deleteExistingComment = async (commentId) => {
    const { rowCount } = await pool.query(`
        DELETE FROM comments
        WHERE comment_id = $1;
        `, [commentId]
    );
    return rowCount;
};

const getUserIdRole = async (id) => {
    const { rows } = await pool.query(`
        SELECT user_id, role
        FROM users
        WHERE user_id = $1;
        `, [id]
    );
    return rows[0];
};

const getUserByEmail = async (email) => {
    const { rows } = await pool.query(`
        SELECT *
        FROM users WHERE email = $1;
        `, [email]
    );
    return rows[0];
}

const postCreateUser = async (username, email, password) => {
    const { rows } = await pool.query(`
        INSERT INTO users (username, email, password)
        VALUES
            ($1, $2, $3) RETURNING user_id, username, email, created_at;
        `, [username, email, password]
    );
    return rows[0];
}

export default {
    getAllReviews,
    getAllPublishedReviews,
    getPublishedReviewDetails,
    getPublishedReviewComments,
    getReviewDetails,
    getReviewsCount,
    getPublishedReviewsCount,
    getUnPublishedReviewsCount,
    getCommentsCount,
    getUsers,
    getGenres,
    getMediaTypes,
    getDemographics,
    getUserIdRole,
    getUserByEmail,
    postCreateUser,
    postCreateNewReview,
    postCreateNewComment,
    patchExistingReview,
    deleteExistingReview,
    deleteExistingComment
}