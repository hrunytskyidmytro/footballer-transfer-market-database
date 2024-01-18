const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

let ARR_USERS = [
    {
        id: 'u1',
        name: 'Dmytro Hrunytskyi',
        email: 'test@test.com',
        password: 'testers',
        role: 'admin'
    }
];

const getUsers = (req, res, next) => {
    res.json({ users: ARR_USERS });
};

const signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError(
            'Invalid inputs passed, please check your data.',
            422
        );
    }

    const { name, email, password, role } = req.body;

    const hasUser = ARR_USERS.find(u => u.email === email);
    if (hasUser) {
        throw new HttpError(
            'Could not create user, email already exists.',
            422
        );
    }

    const createdUser = {
        id: uuidv4(),
        name,
        email,
        password,
        role
    };

    ARR_USERS.push(createdUser);

    res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = ARR_USERS.find(u => u.email === email);

    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError(
            'Could not identify user, credentials seem to be wrong.',
            401
        );
    }

    res.json({ message: 'Logged in!' });
};


exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
