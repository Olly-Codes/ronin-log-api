import bcrypt from "bcrypt";
import db from "../config/db/queries.js";
import JWT from "../utils/issueJwt.js";

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

const postRegister = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json(
            {
                error: "Missing required fields"
            }
        )
    }

    try {
        const user = await db.getUserByEmail(email);

        if (user) {
            return res.status(409).json(
                {
                    error: "Account already exists"
                }
            );
        }

        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = await db.postCreateUser(username, email, hashedPass);

        if (newUser) {
            const jwt = JWT.issueJWT(newUser);
            res.status(201).json(
            {
                id: newUser.user_id,
                username: newUser.username,
                email: newUser.email,
                created_at: newUser.created_at,
                token: jwt.token
            }
        )   
        }
    } catch (err) {
        next(err);
    }
}

const postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json(
            {
                error: "Missing required fields"
            }
        )
    }

    try {
        const user = await db.getUserByEmail(email);

        if (!user) {
            return res.status(401).json(
                {
                    error: "Invalid username or password"
                }
            );
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (isValid) {
            const tokenObject = JWT.issueJWT(user);
            return res.status(200).json(
                {
                    id: user.user_id,
                    username: user.username,
                    email: user.email,
                    token: tokenObject.token,
                    expiresIn: tokenObject.expires
                }
            );
        } else {
            return res.status(401).json(
                {
                    error: "Invalid username or password"
                }
            );
        }
    } catch (err) {
        next(err);
    }
}

export default {
    getAllReviews,
    postRegister,
    postLogin
}