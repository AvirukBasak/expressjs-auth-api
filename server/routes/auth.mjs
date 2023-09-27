import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import conn from '../lib/mongodb.mjs';
import { ObjectId } from 'mongodb';

const auth = express.Router();
const db = conn.db(process.env.DATABASE_NAME);

auth.get('/', async (req, res) => {
    res.status(405).message('/auth supports POST only').end();
});

const ErrCodes = {
    POST_MISSING_BODY: 'post:missing_body',
    POST_MISSING_FIELD_OP: 'post:missing_field_op',
    POST_INVALID_OP: 'post:invalid_op',
    AUTH_MISSING_FIELD_EMAIL: 'auth:missing_field_email',
    AUTH_MISSING_FIELD_PASSWD: 'auth:missing_field_passwd',
    AUTH_INCORRECT_PASSWD: 'auth:incorrect_passwd',
    VERIFY_MISSING_FIELD_FTOKEN: 'verify:missing_field_ftoken',
};

/**
 * auth JSON schema for AUTH: used once per session
 * req: POST {
 *   op: "AUTH",
 *   email: "user-mail",
 *   passwd: "user-password"
 * }
 * res: {
 *   btoken: "token-to-use-in-backend",          // this is used backend only, and does not change on new AUTH
 *   ftoken: "token-to-save-in-frontend"         // this is saved in frontend, and will change on new AUTH
 * }
 * 
 * auth JSON schema for VERIFY: used multiple times to validate user during a session in a stateless backend
 * req: POST {
 *   op: "VERIFY",
 *   ftoken: "token-to-save-in-frontend"
 * }
 * res: {
 *   email: "user-mail" or null,
 *   btoken: "token-to-use-in-backend" or null   // valid btoken if user found else null
 * }
 * 
 * MongoDB document schema:
 * { email: string, passwd: string, btoken: string, ftoken: string[] }
 */
auth.post('/', async (req, res) => {
    const body = req.body;
    if (!body) {
        res.status(400)
            .json({ code: ErrCodes.POST_MISSING_BODY })
            .end();
        return;
    }

    const op = body.op?.toString();
    if (!op) {
        res.status(400)
            .json({ code: ErrCodes.POST_MISSING_FIELD_OP })
            .end();
        return;
    }

    switch (op) {
        case 'AUTH': {
            const email = body.email?.toString();
            if (!email) {
                res.status(400)
                    .json({ code: ErrCodes.AUTH_MISSING_FIELD_EMAIL })
                    .end();
                return;
            }

            let passwd = body.passwd?.toString();
            if (!passwd) {
                res.status(400)
                    .json({ code: ErrCodes.AUTH_MISSING_FIELD_PASSWD })
                    .end();
                return;
            }
            passwd = bcrypt.hashSync(passwd, Number(process.env.HASH_SALT_LENGTH));

            /* document schema { email: string, passwd: string, btoken: string, ftoken: string[] } */
            const data = await db.collection('auth').findOne({ email });

            // email registered but password not matching
            if (data?.email === email && data?.passwd !== passwd) {
                res.status(403)
                    .json({ code: ErrCodes.AUTH_INCORRECT_PASSWD })
                    .end();
                return;
            }

            let btoken = data?.btoken;
            const ftoken = crypto.randomUUID();

            // no btoken, i.e. user not registered
            if (!data?.btoken) {
                // register user
                btoken = crypto.randomUUID();
                await db.collection('auth').insertOne({ email, passwd, btoken, ftoken: [ftoken] });
            } else {
                await db.collection('auth').updateOne({ btoken }, { '$push': { ftoken } });
            }

            res.status(200)
                .json({ btoken, ftoken })
                .end();
            return;
            break;
        }
        case 'VERIFY': {
            const ftoken = body.ftoken?.toString();
            if (!ftoken) {
                res.status(400)
                    .json({ code: ErrCodes.VERIFY_MISSING_FIELD_FTOKEN })
                    .end();
                return;
            }

            /* document schema { email: string, passwd: string, btoken: string, ftoken: string[] } */
            const data = await db.collection('auth').findOne({ ftoken: { '$elemMatch': ftoken } });

            if (!data?.btoken) {
                res.status(404)
                    .json({ email: null, btoken: null })
                    .end();
                return;
            }

            res.status(200)
                .json({ email: data.email, btoken: data.btoken })
                .end();
            return;
            break;
        }
        default: res.status(400)
            .json({
                code: ErrCodes.INVALID_OP,
                message: 'invalid operation: should be \'AUTH\' or \'VERIFY\''
            })
            .end();
    }
});

export default auth;
