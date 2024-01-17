const express = require('express');
const bodyParser = require('body-parser');

const usersRouters = require('./routes/users-routes');
const footballersRouters = require('./routes/footballers-routes');

const app = express();

app.use(bodyParser.json());

app.use(usersRouters);

app.use('/api/footballers', footballersRouters); // => /api/footballers...

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