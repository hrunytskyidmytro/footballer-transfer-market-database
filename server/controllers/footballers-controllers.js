const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');

const ARR_FOOTBALLERS = [
    {
        id: 'f1',
        name: 'Cristiano',
        surname: 'Ronaldo',
        dateofbirth: '2001-12-12',
        country: 'Portugal',
        nationality: 'portuguese',
        positiononthefield: 'attacker',
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
    const { name, surname, dateofbirth, country, nationality, positiononthefield, club } = req.body;

    const createdFootballer = {
        id: uuidv4(),
        name,
        surname,
        dateofbirth,
        country,
        nationality,
        positiononthefield,
        club
    };

    ARR_FOOTBALLERS.push(createdFootballer);

    res.status(201).json({ footballer: createdFootballer });
}; 

exports.getFootballerById = getFootballerById;
exports.createFootballer = createFootballer;