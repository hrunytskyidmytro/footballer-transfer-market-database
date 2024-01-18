const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Footballer = require('../models/footballer');

let ARR_FOOTBALLERS = [
    {
        id: 'f1',
        name: 'Cristiano',
        surname: 'Ronaldo',
        birthDate: '2001-12-12',
        nationality: 'portuguese',
        position: 'attacker',
        club: 'Al-Nasr',
        creator: 'u1'
    }
];

const getFootballerById = async (req, res, next) => {
    const footballerId = req.params.fid; // { fid: 'f1' }

    let footballer;
    try {
        footballer = await Footballer.findById(footballerId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a footballer.',
            500
        ); 
        return next(error);
    }

    if (!footballer) {
        const error = new HttpError(
            'Could not find a footballer for the provided id.',
            404
        );
        return next(error);
    }

    res.send({ footballer: footballer.toObject({ getters: true }) }); // => { footballer } => { footballer: footballer }
};

const createFootballer = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return next(new HttpError(
            'Invalid inputs passed, please check your data.',
            422
        ));
    }

    const { name, surname, birthDate, nationality, position, club, creator } = req.body;

    const createdFootballer = new Footballer({
        name,
        surname,
        nationality,
        birthDate,
        position,
        club,
        image: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg',
        creator
    });

    try {
        await createdFootballer.save();
    } catch (err) {
        const error = new HttpError(
            'Creating footballer failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ footballer: createdFootballer });
}; 

const updateFootballer = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError(
            'Invalid inputs passed, please check your data.',
            422
        );
    }

    const { name, surname, birthDate, nationality, position, club } = req.body;
    const footballerId = req.params.fid;

    const updatedFootballer = { ...ARR_FOOTBALLERS.find(f => f.id === footballerId) };
    const footballerIndex = ARR_FOOTBALLERS.findIndex(f => f.id === footballerId);
    updatedFootballer.name = name;
    updatedFootballer.surname = surname;
    updatedFootballer.birthDate = birthDate;
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