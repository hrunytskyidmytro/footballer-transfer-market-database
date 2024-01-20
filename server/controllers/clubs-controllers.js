const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Club = require('../models/club');

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


exports.getClubs = getClubs;
exports.getClubById = getClubById;