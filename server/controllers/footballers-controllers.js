const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Footballer = require('../models/footballer');
const User = require('../models/user');

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

const getFootballersByUserId = async (req, res, next) => {
    const footballerId = req.params.fid;
  
    let userWithFootballers;
    try {
        userWithFootballers = await User.findById(footballerId).populate('footballers');
    } catch (err) {
      const error = new HttpError(
        'Fetching footballers failed, please try again later.',
        500
      );
      return next(error);
    }
  
    if (!userWithFootballers || userWithFootballers.footballers.length === 0) {
      return next(
        new HttpError(
                'Could not find footballers for the provided user id.', 
                404
            )
      );
    }
  
    res.json({
      footballers: userWithFootballers.footballers.map(footballer =>
        footballer.toObject({ getters: true })
      )
    });
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

    const { name, surname, birthDate, nationality, position, creator } = req.body;

    const createdFootballer = new Footballer({
        name,
        surname,
        nationality,
        birthDate,
        position,
        image: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg',
        creator,
        clubs: [],
        transfers: []
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError(
            'Creating footballer failed, please try again.',
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError(
            'Could not find user for provided id.',
            404
        );
        return next(error);
    }

    console.log(user);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdFootballer.save({ session: sess });
        user.footballers.push(createdFootballer);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Creating footballer failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ footballer: createdFootballer });
}; 

const updateFootballer = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError(
                'Invalid inputs passed, please check your data.',
                422
            ) 
        );
    }

    const { name, surname, birthDate, nationality, position } = req.body;
    const footballerId = req.params.fid;

    let footballer;
    try {
        footballer = await Footballer.findById(footballerId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update footballer.',
            500
        );
        return next(error);
    }

    footballer.name = name;
    footballer.surname = surname;
    footballer.birthDate = birthDate;
    footballer.nationality = nationality;
    footballer.position = position;

    try {
        await footballer.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update footballer.',
            500
        );
        return next(error);
    }

    res.status(200).json({ footballer: footballer.toObject({ getters: true}) });
};

const deleteFootballer = async (req, res, next) => {
    const footballerId = req.params.fid;

    let footballer;
    try {
        footballer = await Footballer.findById(footballerId).populate('creator');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete footballer.',
            500
        );
        return next(error);
    }

    if (!footballer) {
        const error = new HttpError(
            'Could not find footballer for this id.',
            404
        );
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await footballer.deleteOne({ session: sess });
        footballer.creator.footballers.pull(footballer);
        await footballer.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete footballer.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted footballer.' });
};

exports.getFootballerById = getFootballerById;
exports.getFootballersByUserId = getFootballersByUserId;
exports.createFootballer = createFootballer;
exports.updateFootballer = updateFootballer;
exports.deleteFootballer = deleteFootballer;