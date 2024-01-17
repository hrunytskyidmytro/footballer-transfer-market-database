const express = require('express');
const bodyParser = require('body-parser');

const usersRouters = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());

app.use(usersRouters);

app.listen(5001, () => {
    console.log('Server is running!');
});