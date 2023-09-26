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

## API Error Codes
```js
const ErrCodes = {
    POST_MISSING_BODY: 'post:missing_body',
    POST_MISSING_FIELD_OP: 'post:missing_field_op',
    POST_INVALID_OP: 'post:invalid_op',
    AUTH_MISSING_FIELD_EMAIL: 'auth:missing_field_email',
    AUTH_MISSING_FIELD_PASSWD: 'auth:missing_field_passwd',
    AUTH_INCORRECT_PASSWD: 'auth:incorrect_passwd',
    VERIFY_MISSING_FIELD_FTOKEN: 'verify:missing_field_ftoken',
};
```
