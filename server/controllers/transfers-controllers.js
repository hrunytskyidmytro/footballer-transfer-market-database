const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Transfer = require('../models/transfer');
const Footballer = require('../models/footballer');

const getTransfers = async (req, res, next) => {
    let transfers;
    try {
        transfers = await Transfer.find({});
    } catch (err) {
        const error = new HttpError(
            'Fetching transfers failed, please try again later.',
            500
        );
        return next(error);
    }

    res.json({ transfers: transfers.map(transfer => transfer.toObject({ getters: true })) });
};

const getTransferById = async (req, res, next) => {
    const transferId = req.params.fid;

    let transfer;
    try {
        transfer = await Transfer.findById(transferId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a transfer.',
            500
        ); 
        return next(error);
    }

    if (!transfer) {
        const error = new HttpError(
            'Could not find a transfer for the provided id.',
            404
        );
        return next(error);
    }

    res.send({ transfer: transfer.toObject({ getters: true }) });
};

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

exports.getTransfers = getTransfers;
exports.getTransferById = getTransferById;
exports.createTransfer = createTransfer;
exports.updateTransfer = updateTransfer;
exports.deleteTransfer = deleteTransfer;
