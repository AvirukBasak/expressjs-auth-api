# MERN Auth API

## Seting Environment Variables
Create a new `.env.local` and add private `MONGODB_URI` to it.
See `server/.env` for required environment variables.

## Run App
You can customize your build script by modifying [`index.js`](index.js) at the repository root.

You need to run the following based on your requirements:
- `npm run install` install all dependencies
- `npm run build` generate the `static` directory
- `npm start` start the app

## API Documentation

### Overview

The Authentication API provides endpoints for user authentication and verification. It is designed to be used in a stateless backend system and involves two main operations: `AUTH` and `VERIFY`. The API is intended to secure user sessions and provides tokens for backend and frontend authentication.

### Endpoints

#### 1. Authentication (AUTH)

- **Description**: This operation is used for initial user authentication and is executed once only to signup or login the user.

- **Request Method**: POST

- **Request Endpoint**: `/auth`

- **Request Body (JSON)**:
  ```json
  {
    "op": "AUTH",
    "email": "user-mail",
    "passwd": "user-password"
  }
  ```

- **Response Body (JSON)**:
  ```json
  {
    "btoken": "token-to-use-in-backend",
    "ftoken": "token-to-save-in-frontend"
  }
  ```

- **Response Codes**:
  - 200 OK: Successful authentication
  - 401 Unauthorized: Authentication failed

- **Notes**:
  - The `btoken` is intended for backend use and remains constant.
  - The `ftoken` should be saved in the frontend and will change on each new authentication.

#### 2. Verification (VERIFY)

- **Description**: This operation is used to validate the user during a session and can be executed multiple times.

- **Request Method**: POST

- **Request Endpoint**: `/verify`

- **Request Body (JSON)**:
  ```json
  {
    "op": "VERIFY",
    "ftoken": "token-to-save-in-frontend"
  }
  ```

- **Response Body (JSON)**:
  ```json
  {
    "email": "user-mail" or null,
    "btoken": "token-to-use-in-backend" or null
  }
  ```

- **Response Codes**:
  - 200 OK: User successfully verified
  - 401 Unauthorized: Verification failed

- **Notes**:
  - The `email` field will contain the user's email address if a valid user is found, or it will be null if the user is not found or verification fails.
  - The `btoken` will be provided if a valid user is found, otherwise, it will be null.

### API Error Codes
Here are the error codes that may be encountered when using the Authentication API:

- `post:missing_body`
- `post:missing_field_op`
- `post:invalid_op`
- `auth:missing_field_email`
- `auth:missing_field_passwd`
- `auth:incorrect_passwd`
- `verify:missing_field_ftoken`

### MongoDB Document Schema

The Authentication API relies on a MongoDB document schema to store user information. The schema is as follows:

```json
{
  "email": "string",
  "passwd": "string",
  "btoken": "string",
  "ftoken": ["string"]
}
```

- `email`: The user's email address.
- `passwd`: The user's password (hashed and securely stored).
- `btoken`: The token used for backend authentication (constant for each user).
- `ftoken`: An array of tokens used for frontend authentication (changes on each new authentication).

### Usage Guidelines

- Ensure that user passwords are securely hashed and stored.
- Safeguard the `btoken` value as they are crucial for user authentication.
- Use the `VERIFY` operation to validate users during their session.
- Handle authentication and verification errors gracefully, returning appropriate HTTP status codes.
