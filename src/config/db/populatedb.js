import "dotenv/config";
import { Client } from "pg";

const SQL = `
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS demographics (
    demographic_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS genres (
    genre_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS media_type (
    media_type_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
    review_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL,
    demographic_id INTEGER,
    media_type_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    score SMALLINT CHECK (score BETWEEN 1 AND 10),
    body TEXT NOT NULL,
    cover_image_url TEXT,
    published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (demographic_id) REFERENCES demographics (demographic_id),
    FOREIGN KEY (media_type_id) REFERENCES media_type (media_type_id)
);

CREATE TABLE IF NOT EXISTS review_genres (
    review_id INTEGER NOT NULL REFERENCES reviews (review_id),
    genre_id INTEGER NOT NULL REFERENCES genres (genre_id),
    PRIMARY KEY (review_id, genre_id)
);

CREATE TABLE IF NOT EXISTS comments (
    comment_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    review_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (review_id) REFERENCES reviews (review_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

INSERT INTO demographics (name)
VALUES
    ('kodomo'),
    ('shounen'),
    ('shoujo'),
    ('seinen'),
    ('josei');

INSERT INTO genres (name)
VALUES
    ('action'),
    ('adventure'),
    ('comedy'),
    ('drama'),
    ('ecchi'),
    ('fantasy'),
    ('horror'),
    ('mecha'),
    ('psychological'),
    ('romance'),
    ('sci-fi'),
    ('slice of life'),
    ('sports'),
    ('supernatural'),
    ('thriller');

INSERT INTO media_type (name)
VALUES
    ('manga'),
    ('anime'),
    ('light Novel'),
    ('web Novel'),
    ('visual Novel'),
    ('doujinshi'),
    ('manhwa'),
    ('manhua'),
    ('webtoons');


INSERT INTO users (username, email, password, role)
VALUES
    ('ronin_admin', 'admin@roninlog.com', '$argon2id$v=19$m=19456,t=2,p=1$jbfaOqbfrxhYILrDmtoR8Q$zFiAke6QTrVl79NTkZFy1hZvAhryBKm+rnnzBY2/KTs', 'admin'),
    ('mark', 'mark@example.com', '$argon2id$v=19$m=19456,t=2,p=1$jbfaOqbfrxhYILrDmtoR8Q$4w+acdup4ntPKABVXM1K8QLZ9JNNafhG5KhLVlkF4ww', 'user'),
    ('jack', 'jack@example.com', '$argon2id$v=19$m=19456,t=2,p=1$jbfaOqbfrxhYILrDmtoR8Q$sN1iWNCpDDJGKs7Z+Au0Kb0yiM0SbWHpaOKeI8QGpBc', 'user');


INSERT INTO reviews (user_id, demographic_id, media_type_id, title, score, body, cover_image_url, published)
VALUES
    (1, 2, 2, 'Frieren: Beyond Journey''s End', 10, 'Lorem ipsum dolar sit amet, consectetur adipiscing elit.', 'https://example.com/covers/frieren.jpg', true),
    (1, 4, 1, 'Chainsaw Man', 9, 'Lorem ipsum dolar sit amet, consectetur adipiscing elit.', 'https://example.com/covers/csm.jpg', true),
    (1, 2, 3, 'Mushoku Tensei: Jobless Reincarnation', 7, 'Lorem ipsum dolar sit amet, consectetur adipiscing elit.', 'https://example.com/covers/mushoku.jpg', false),
    (1, 4, 2, 'Vinland Saga', 10, 'Lorem ipsum dolar sit amet, consectetur adipiscing elit.', 'https://example.com/covers/vinland.jpg', true);

INSERT INTO review_genres (review_id, genre_id)
VALUES
    (1, 2),
    (1, 6),
    (2, 1),
    (2, 9),
    (2, 7),
    (3, 6),
    (3, 2),
    (4, 1),
    (4, 4);

INSERT INTO comments (review_id, user_id, content)
VALUES
    (1, 2, 'This show made me cry in a way I did not expect going in at all.'),
    (1, 3, 'The pacing in the back half is criminally underrated.'),
    (2, 2, 'Denji is such a mess and I love him for it'),
    (2, 3, 'MAPPA absolutelty created a phenomenal experience with this animation!.'),
    (4, 2, 'Thorfinn''s arc across this whole series is on of the best redemption stories in anime.');
`;

(async () => {
    console.log("seeding...");
    const client = new Client({
        connectionString: process.env.DB_DEV,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
})();