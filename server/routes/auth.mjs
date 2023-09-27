import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

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

            const passwd = body.passwd?.toString();
            if (!passwd) {
                res.status(400)
                    .json({ code: ErrCodes.AUTH_MISSING_FIELD_PASSWD })
                    .end();
                return;
            }

            const data = await db.collection('auth').findOne({ email });
            const passwdMatching = bcrypt.compareSync(passwd, data?.passwd || '');

            // email registered but password not matching
            if (data?.email === email && !passwdMatching) {
                res.status(401)
                    .json({ code: ErrCodes.AUTH_INCORRECT_PASSWD })
                    .end();
                return;
            }

            let btoken = data?.btoken;
            const ftoken = uuidv4();

            // no btoken, i.e. user not registered
            if (!data?.btoken) {
                // register user
                btoken = uuidv4();
                const passwd_hash = bcrypt.hashSync(passwd, Number(process.env.HASH_SALT_LENGTH));
                await db.collection('auth').insertOne({ email, passwd: passwd_hash, btoken, ftoken: [ftoken] });
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

            /* findOne: returns single document as JSON
             * filter parameter:
             *   - elemMatch: matches if data present in db array
             *   - eq: equality
             * options parameter:
             *   - projection: the option to choose which fields should be projected in response */
            const data = await db.collection('auth').findOne(
                { ftoken: { '$elemMatch': { '$eq': ftoken }}},
                { projection: { email: 1, btoken: 1 }}
            );

            if (!data?.btoken) {
                res.status(401)
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
