import "dotenv/config";
import pool from "./db/pool";
import db from "./db/queries";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY,
    algorithms: ['HS256']
};

const strategy = new JwtStrategy(options, async (payload, done) => {
    
    try {
        const user = await db.getUserId(payload.sub);

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, null);
    }
});

