import express from 'express';
import cors from 'cors';
import 'express-async-errors';

import './loadEnv.mjs';
import auth from './routes/auth.mjs';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.use(function(req, res, next) {
    console.log(`[${(new Date()).toLocaleString()}] ${req.ip} ${req.method}: ${req.url}`);
    next();
});

// load routes
app.use('/auth', auth);
app.use('/', express.static(PATHS.build));

// global error handling
app.use((err, req, res, next) => {
    console.error(`[${(new Date()).toLocaleString()}] ${req.ip} ERROR: ${err?.stack}`);
    res.status(500).json({}).end();
    next();
});

// start the Express server
app.listen(PORT, () => {
    console.log(`Server is running at 'http://localhost:${PORT}'`);
});
