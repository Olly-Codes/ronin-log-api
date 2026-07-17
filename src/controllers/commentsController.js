import db from "../config/db/queries.js";


const getComments = async (req, res, next) => {

    const { countOnly } = req.query;

    try {
        if (countOnly) {
            const commentsCount = await db.getCommentsCount();
            return res.status(200).json({ commentsCount });
        }

        const comments = await db.getComments();

        if (comments) {
            return res.status(200).json({ comments });
        }


    } catch (err) {
        next(err);
    }
}

const postCreateComment = async (req, res, next) => {
    
    try {
        const { id } = req.params;
        const { content } = req.body;
        
        const userId = req.user.user_id;

        if (!content || content.lengh === 0) {
            return res.status(400).json({ error: "Comment content is required" });
        }

        const comment = await db.postCreateNewComment(id, userId, content);
        res.status(201).json({ comment });
    } catch (err) {
        next(err)
    }
}

const deleteComment = async (req, res, next) => {

    try {
        const { id } = req.params;
        const rowCount = await db.deleteExistingComment(id);

        if (rowCount === 0) {
            return res.status(404).json({ error: "Comment not found" });
        }

        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

export default {
    getComments,
    postCreateComment,
    deleteComment
}