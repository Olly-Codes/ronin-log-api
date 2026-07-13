# Ronin Log Api
A REST API for a review platform for anime, manga, light novels and more. The API is built with Node.js, Express and PostgreSQL.
Ronin Log allows an admin to publish reviews with genres, demographics, and media types. Registered users can comment on the reviews written

This is the backend only that will sit behind a front end to consume like a dashboard for admin or a public facing platform to allow users to read and comment on reviews

Full route documentation lives in [API.md](https://github.com/Olly-Codes/ronin-log-api/blob/main/API.md)

## Overview
The reviews in Ronin Log are organized by media type, demographic, and genres. The reviews can in two states: published / unpublished which allows admin to write a review to later publish it if needed.
Authentication is handled via JWTs and role-based access. Registered used can comment on reviews, and admin content is gated behind roles upon authenticaion.

## Features
- Full CRUD on reviews, which only admins have any kind of write access to
- Comments can be made on any review by authenticated users
- Reviews are tagged with a media type, a demographic and one or multiple genres
- Published and un-published states of reviews
- Registration and login via `passport.js` using a JWT strategy (HS256 Bearer token auth)
- Role-based access
- Passwords are hashed and comapred with `bcrypt`

## Tech Stack
- Node.js
- Express
- PostgreSQL

## Getting Started
### Prerequisites
- Node.js
- PostgreSQL

### Installation
1. Clone this repo
```bash
git clone https://github.com/Olly-Codes/ronin-log-api.git
cd ronin-log-api
```

2. Instal dependencies
```bash
npm install
```

3. Create a separate `.env` file in the root directory. The variables should be listed in the `.env example` in this repo
4. Seed the database
```bash
npm run db
```
5. Start the development server
```bash
npm run dev
```

See [API.md](https://github.com/Olly-Codes/ronin-log-api/blob/main/API.md) for the full list of endpoints and auth requirements

## What I learned
- Stateless authentication with JWT and `passport.js`
- Trade-offs between symmetric (HS256) and asymmetric (RS256) signing

