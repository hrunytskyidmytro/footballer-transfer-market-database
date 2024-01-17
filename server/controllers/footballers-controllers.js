const HttpError = require('../models/http-error');

const ARR_FOOTBALLERS = [
    {
        id: 'f1',
        name: 'Cristiano',
        surname: 'Ronaldo',
        dateofbirth: '2001-12-12',
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

exports.getFootballerById = getFootballerById;