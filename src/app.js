import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "./config/passport.js";

import indexRouter from "./routes/indexRouter.js";
import reviewsRouter from "./routes/reviewsRouter.js";
import commentsRouter from "./routes/commentsRouter.js";
import genresRouter from "./routes/genresRouter.js";
import demographicsRouter from "./routes/demographicsRouter.js";
import mediaTypesRouter from "./routes/mediaTypesRouter.js";
import authRouter from "./routes/authRouter.js";
import adminRouter from "./routes/adminRouter.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cors({
    origin: "http://localhost:5173",
}));

app.use("/", indexRouter);
app.use("/reviews", reviewsRouter);
app.use("/comments", commentsRouter);
app.use("/genres", genresRouter);
app.use("/demographics", demographicsRouter);
app.use("/media-types", mediaTypesRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);

app.use((req, res, next) => {
    const err = new Error("That route does not exist");
    err.statusCode = 404;
    next(err);
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const errorMessage = statusCode === 500 ?
    "Something went wrong on our end!" : err.message;

    if (process.env.NODE_ENV !== "production") {
        console.error(err.stack);
    }

    res.status(statusCode).json(
        {
            error: errorMessage
        }
    );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) {
        throw err;
    };
    console.log(`Listening on port ${PORT}`);
});