# Ronin Log API Reference

Base URL: `http://localhost:3001` (adjust for your environment)

## Authentication

Protected routes require a JWT sent via the `Authorization` header using the Bearer scheme:
```bash
Authorization: Bearer <token>
```

Tokens are issued on register and login, and expire after 1 day.

| Method | Endpoint | Auth required | Description |
| ------ | -------- | ------------- | ----------- |
| POST   | `/register` | No | Create a new account, returns a token |
| POST   | `/login` | No | Log in with email/password, returns a token |

## Index
| Method | Endpoint | Auth required | Description |
| ------ | -------- | ------------- | ----------- |
| GET   | `/` | No | Returns a success message if API is running |

## Reviews
| Method | Endpoint | Auth required | Description |
| ------ | -------- | ------------- | ----------- |
| GET   | `/reviews` | No | Lists published reviews |
| GET   | `/reviews/:id` | No | Get a single published review |
| POST   | `/reviews` | Admin | Create a new review |
| PATCH   | `/reviews/:id` | Admin | Update a review |
| DELETE   | `/reviews/:id` | Admin | Delete a review |

## Comments
| Method | Endpoint | Auth required | Description |
| ------ | -------- | ------------- | ----------- |
| GET   | `/reviews/:id/comments` | No | Lists comments from a review |
| POST   | `/reviews/:id/comments` | Yes | Add a comment to a review |
| DELETE   | `/comments/:id` | Admin | Delete a comment |

## Genres, Demographics, Media Types
| Method | Endpoint | Auth required | Description |
| ------ | -------- | ------------- | ----------- |
| GET   | `/genres` | No | Lists all genres |
| GET   | `/demographics` | No | Lists all demographics |
| GET   | `/media-types` | No | Lists all media types ||
