const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

let ARR_FOOTBALLERS = [
    {
        id: 'f1',
        name: 'Cristiano',
        surname: 'Ronaldo',
        dateofbirth: '2001-12-12',
        nationality: 'portuguese',
        position: 'attacker',
        club: 'Al-Nasr',
        creator: 'u1'
    }
];

const getFootballerById = (req, res, next) => {
    const footballerId = req.params.fid; // { fid: 'f1' }

    const footballer = ARR_FOOTBALLERS.find( f => {
        return f.id === footballerId;
    });

    if (!footballer) {
        throw new HttpError(
            'Could not find a footballer for the provided id.',
            404
        );
    }

    res.send({ footballer }); // => { footballer } => { footballer: footballer }
};

const createFootballer = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        next(new HttpError(
            'Invalid inputs passed, please check your data.',
            422
        ));
    }

    const { name, surname, dateofbirth, nationality, position, club } = req.body;

    const createdFootballer = {
        id: uuidv4(),
        name,
        surname,
        dateofbirth,
        nationality,
        position,
        club
    };

    ARR_FOOTBALLERS.push(createdFootballer);

    res.status(201).json({ footballer: createdFootballer });
}; 

const updateFootballer = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError(
            'Invalid inputs passed, please check your data.',
            422
        );
    }

    const { name, surname, dateofbirth, nationality, position, club } = req.body;
    const footballerId = req.params.fid;

    const updatedFootballer = { ...ARR_FOOTBALLERS.find(f => f.id === footballerId) };
    const footballerIndex = ARR_FOOTBALLERS.findIndex(f => f.id === footballerId);
    updatedFootballer.name = name;
    updatedFootballer.surname = surname;
    updatedFootballer.dateofbirth = dateofbirth;
    updatedFootballer.nationality = nationality;
    updatedFootballer.position = position;
    updatedFootballer.club = club;

    ARR_FOOTBALLERS[footballerIndex] = updatedFootballer;

    res.status(200).json({ footballer: updatedFootballer });
};

const deleteFootballer = (req, res, next) => {
    const footballerId = req.params.fid;

    if (!ARR_FOOTBALLERS.find(f => f.id === footballerId)) {
        throw new HttpError(
            'Could not find a footballer for that id.',
            404
        );
    }

    ARR_FOOTBALLERS = ARR_FOOTBALLERS.filter(f => f.id !== footballerId);

    res.status(200).json({ message: 'Deleted footballer.' });
};

exports.getFootballerById = getFootballerById;
exports.createFootballer = createFootballer;
exports.updateFootballer = updateFootballer;
exports.deleteFootballer = deleteFootballer;