const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Footballer = require('../models/footballer');
const Transfer = require('../models/transfer');
const Club = require('../models/club');
const User = require('../models/user');

//Footballer

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

//Transfer

const createTransfer = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return next(new HttpError(
            'Invalid inputs passed, please check your data.',
            422
        ));
    }

    const { footballer, fromClub, toClub, transferFee, transferDate, transferType } = req.body;

    if (fromClub === toClub) {
        const error = new HttpError(
            'Source and destination clubs cannot be the same.',
            422
        );
        return next(error);
    }

    let footballerForTransfer;
    try {
        footballerForTransfer = await Footballer.findById(footballer);
    } catch (err) {
        const error = new HttpError(
            'Creating footballer failed, please try again.',
            500
        );
        return next(error);
    }

    if (!footballerForTransfer) {
        const error = new HttpError(
            'Could not find user for provided id.',
            404
        );
        return next(error);
    }

    console.log(footballerForTransfer);
    
    const createdTransfer = new Transfer({
        footballer,
        fromClub,
        toClub,
        transferFee,
        transferDate,
        transferType
    });

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdTransfer.save({ session: sess });
        footballerForTransfer.transfers.push(createdTransfer);
        await footballerForTransfer.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.log(err.message);
        const error = new HttpError(
            'Creating transfer failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ transfer: createdTransfer });
};

const updateTransfer = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return next(new HttpError(
            'Invalid inputs passed, please check your data.',
            422
        ));
    }

    const { transferFee, transferDate, transferType } = req.body;  
    const transferId = req.params.tid;  

    let transfer;
    try {
        transfer = await Transfer.findById(transferId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update transfer.',
            500
        );
        return next(error);
    }

    transfer.transferFee = transferFee;
    transfer.transferDate = transferDate;
    transfer.transferType = transferType;

    try {
        await transfer.save();
    } catch (err) {
        console.log(err.message);
        const error = new HttpError(
            'Something went wrong, could not update transfer.',
            500
        );
        return next(error);
    }

    res.status(200).json({ transfer: transfer.toObject({ getters: true}) });
};

const deleteTransfer = async (req, res, next) => {
    const transferId = req.params.tid;

    let transfer;
    try {
        transfer = await Transfer.findById(transferId).populate('footballer');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete transfer.',
            500
        );
        return next(error);
    }

    if (!transfer) {
        const error = new HttpError(
            'Could not find transfer for this id.',
            404
        );
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await transfer.deleteOne({ session: sess });
        transfer.footballer.transfers.pull(transfer);
        await transfer.footballer.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.log(err.message);
        const error = new HttpError(
            'Something went wrong, could not delete transfer.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted transfer.' });
};

//Club

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

//User

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
        const error = new HttpError(
            'Fetching users failed, please try again later.',
            500
        );
        return next(error);
    }

    res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

exports.getFootballersByUserId = getFootballersByUserId;
exports.createFootballer = createFootballer;
exports.updateFootballer = updateFootballer;
exports.deleteFootballer = deleteFootballer;
exports.createTransfer = createTransfer;
exports.updateTransfer = updateTransfer;
exports.deleteTransfer = deleteTransfer;
exports.createClub = createClub;
exports.updateClub = updateClub;
exports.deleteClub = deleteClub;
exports.getUsers = getUsers;
