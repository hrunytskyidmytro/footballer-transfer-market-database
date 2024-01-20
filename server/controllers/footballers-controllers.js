const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Footballer = require('../models/footballer');

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

exports.getFootballerById = getFootballerById;