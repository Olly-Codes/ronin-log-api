import db from "../config/db/queries.js";

const postCreateComment = async (req, res, next) => {
    
    try {
        const { id } = req.params;
        const { content } = req.body;
        
        // TODO: Change once auth is implemented
        const userId = 3;

        if (!content || content.lengh === 0) {
            return res.status(400).json({ error: "Comment content is required" });
        }

        const comment = await db.postCreateNewComment(id, userId, content);
        res.status(201).json({ comment });
    } catch (err) {
        next(err)
    }
}

export default {
    postCreateComment
}