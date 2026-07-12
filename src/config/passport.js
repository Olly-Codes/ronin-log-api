import "dotenv/config";
import passport from "passport";

import db from "./db/queries.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY,
    algorithms: ['HS256']
};

const strategy = new JwtStrategy(options, async (payload, done) => {
    
    try {
        const user = await db.getUserIdRole(payload.sub);

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, null);
    }
});

passport.use(strategy);

export default passport;
