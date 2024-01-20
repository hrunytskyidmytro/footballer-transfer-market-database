const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const footballersRouters = require('./routes/footballers-routes');
const usersRouters = require('./routes/users-routes');
const transfersRoutes = require('./routes/transfers-routes');
const clubsRoutes = require('./routes/clubs-routes');
const adminsRoutes = require('./routes/admins-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/footballers', footballersRouters); // => /api/footballers...

app.use('/api/users', usersRouters); // => /api/users...

app.use('/api/transfers', transfersRoutes); // => /api/transfers...

app.use('/api/clubs', clubsRoutes); // => /api/clubs...

app.use('/api/admins', adminsRoutes); // => /api/admins...

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

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@sandbox.itlcrlu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(5001, () => {
            console.log('Server is running!');
        });
    })
    .catch(err => {
        console.log(err.message);
    });