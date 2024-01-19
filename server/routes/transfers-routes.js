const express = require('express');
const { check } = require('express-validator');

const transfersController = require('../controllers/transfers-controllers');

const router = express.Router();

router.get('/', transfersController.getTransfers);

router.get('/:tid', transfersController.getTransferById);

router.post(
    '/',
    [
        check('footballer')
            .not()
            .isEmpty(),
        check('fromClub')
            .not()
            .isEmpty(),
        check('toClub')
            .not()
            .isEmpty(),
        check('transferFee')
            .not()
            .isEmpty(),
        check('transferDate')
            .not()
            .isEmpty(),
        check('transferType')
            .not()
            .isEmpty()
    ], 
    transfersController.createTransfer
);

router.patch(
    '/:tid',
    [
        check('transferFee')
            .not()
            .isEmpty(),
        check('transferDate')
            .not()
            .isEmpty(),
        check('transferType')
            .not()
            .isEmpty()
    ],  
    transfersController.updateTransfer
);

router.delete('/:tid', transfersController.deleteTransfer);

module.exports = router;