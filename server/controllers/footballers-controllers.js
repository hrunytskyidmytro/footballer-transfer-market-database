const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');

let ARR_FOOTBALLERS = [
    {
        id: 'f1',
        name: 'Cristiano',
        surname: 'Ronaldo',
        dateofbirth: '2001-12-12',
        country: 'Portugal',
        nationality: 'portuguese',
        position: 'attacker',
        club: 'Al-Nasr'
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
    const { name, surname, dateofbirth, country, nationality, position, club } = req.body;

    const createdFootballer = {
        id: uuidv4(),
        name,
        surname,
        dateofbirth,
        country,
        nationality,
        position,
        club
    };

    ARR_FOOTBALLERS.push(createdFootballer);

    res.status(201).json({ footballer: createdFootballer });
}; 

const updateFootballer = (req, res, next) => {
    const { name, surname, dateofbirth, country, nationality, position, club } = req.body;
    const footballerId = req.params.fid;

    const updatedFootballer = { ...ARR_FOOTBALLERS.find(f => f.id === footballerId) };
    const footballerIndex = ARR_FOOTBALLERS.findIndex(f => f.id === footballerId);
    updatedFootballer.name = name;
    updatedFootballer.surname = surname;
    updatedFootballer.dateofbirth = dateofbirth;
    updatedFootballer.country = country;
    updatedFootballer.nationality = nationality;
    updatedFootballer.position = position;
    updatedFootballer.club = club;

    ARR_FOOTBALLERS[footballerIndex] = updatedFootballer;

    res.status(200).json({ footballer: updatedFootballer });
};

const deleteFootballer = (req, res, next) => {
    const footballerId = req.params.fid;
    ARR_FOOTBALLERS = ARR_FOOTBALLERS.filter(f => f.id !== footballerId);

    res.status(200).json({ message: 'Deleted footballer.' });
};

exports.getFootballerById = getFootballerById;
exports.createFootballer = createFootballer;
exports.updateFootballer = updateFootballer;
exports.deleteFootballer = deleteFootballer;