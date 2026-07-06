import "dotenv/config";
import express from "express";

import indexRouter from "./routes/indexRouter.js";
import reviewsRouter from "./routes/reviewsRouter.js";
import commentsRouter from "./routes/commentsRouter.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/reviews", reviewsRouter);
app.use("/comments", commentsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) {
        throw err;
    };
    console.log(`Listening on port ${PORT}`);
});