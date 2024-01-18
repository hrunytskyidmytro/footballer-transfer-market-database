const express = require('express');
const bodyParser = require('body-parser');

const footballersRouters = require('./routes/footballers-routes');
const usersRouters = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/footballers', footballersRouters); // => /api/footballers...

app.use('/api/users', usersRouters); // => /api/users...

app.use((req, res, next) => {
    const error = new HttpError(
        'Could not find this route.',
        404
    );
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});

app.listen(5001, () => {
    console.log('Server is running!');
});