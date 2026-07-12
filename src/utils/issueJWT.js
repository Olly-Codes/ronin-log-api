import "dotenv/config";
import jwt from "jsonwebtoken";

const issueJWT = (user) => {
    const id = user.user_id;
    const expiresIn = "1d";
    const payload = {
        sub: id
    };

    const signedToken = jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        {
            expiresIn,
            algorithm: 'HS256'
        }
    );

    return {
        token: signedToken,
        expires: expiresIn
    };
};

export default {
    issueJWT
}