const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Club = require('../models/club');
const Footballer = require('../models/footballer');
const Transfer = require('../models/transfer');

const getClubs = async (req, res, next) => {
    let clubs;
    try {
        clubs = await User.find({});
    } catch (err) {
        const error = new HttpError(
            'Fetching clubs failed, please try again later.',
            500
        );
        return next(error);
    }

    res.json({ clubs: clubs.map(club => club.toObject({ getters: true })) });
};

const getClubById = async (req, res, next) => {
    const clubId = req.params.fid; 

    let club;
    try {
        club = await Club.findById(clubId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a club.',
            500
        ); 
        return next(error);
    }

    if (!club) {
        const error = new HttpError(
            'Could not find a club for the provided id.',
            404
        );
        return next(error);
    }

    res.send({ club: club.toObject({ getters: true }) }); 
};

const createClub = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return next(new HttpError(
            'Invalid inputs passed, please check your data.',
            422
        ));
    }

    const { name, country } = req.body;

    const createdClub = new Club({
        name,
        country,
        image: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg'
    });

    const footballerId = req.params.fid;

    let footballer;
    try {
        footballer = await Footballer.findById(footballerId);
    } catch (err) {
        const error = new HttpError(
            'Creating footballer failed, please try again.',
            500
        );
        return next(error);
    }

    if (!footballer) {
        const error = new HttpError(
            'Could not find footballer for provided id.',
            404
        );
        return next(error);
    }

    console.log(footballer);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdClub.save({ session: sess });
        footballer.clubs.push(createdClub);
        await footballer.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.log(err.message);
        const error = new HttpError(
            'Creating club failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ club: createdClub });
};

const updateClub = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError(
                'Invalid inputs passed, please check your data.',
                422
            ) 
        );
    }

    const { name, country } = req.body;
    const clubId = req.params.cid;

    console.log(clubId);

    let club;
    try {
        club = await Club.findById(clubId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update club.',
            500
        );
        return next(error);
    }

    club.name = name;
    club.country = country;

    try {
        await club.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update club.',
            500
        );
        return next(error);
    }

    res.status(200).json({ club: club.toObject({ getters: true}) });
};

const deleteClub = async (req, res, next) => {
    const clubId = req.params.cid;

    let club;
    try {
        club = await Club.findById(clubId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete club.',
            500
        );
        return next(error);
    }

    if (!club) {
        const error = new HttpError(
            'Could not find club for this id.',
            404
        );
        return next(error);
    }

    console.log(club);

    let footballer;
    try {
        footballer = await Footballer.findOne({ clubs: clubId }).populate('clubs');
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
        await club.deleteOne({ session: sess });
        footballer.clubs.pull(club);
        await footballer.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.log(err.message);
        const error = new HttpError(
            'Something went wrong, could not delete club.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted club.' });
};

exports.getClubs = getClubs;
exports.getClubById = getClubById;
exports.createClub = createClub;
exports.updateClub = updateClub;
exports.deleteClub = deleteClub;