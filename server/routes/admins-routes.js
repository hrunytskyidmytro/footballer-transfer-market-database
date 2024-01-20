const express = require('express');
const { check } = require('express-validator');

const adminsController = require('../controllers/admins-controllers');

const router = express.Router();

router.get('/user/:fid', adminsController.getFootballersByUserId);

router.post(
    '/', 
    [
        check('name')
            .not()
            .isEmpty(),
        check('surname')
            .not()
            .isEmpty(),
        check('birthDate')
            .not()
            .isEmpty(),
        check('nationality')
            .not()
            .isEmpty(),
        check('position')
            .not()
            .isEmpty(),
        check('creator')
            .not()
            .isEmpty()
    ], 
    adminsController.createFootballer
);

router.patch(
    '/:fid', 
    [
        check('name')
            .not()
            .isEmpty(),
        check('surname')
            .not()
            .isEmpty(),
        check('birthDate')
            .not()
            .isEmpty(),
        check('nationality')
            .not()
            .isEmpty(),
        check('position')
            .not()
            .isEmpty()
    ], 
    adminsController.updateFootballer
);

router.delete('/:fid', adminsController.deleteFootballer);

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
    adminsController.createTransfer
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
    adminsController.updateTransfer
);

router.delete('/:tid', adminsController.deleteTransfer);

router.post(
    '/:fid', 
    [
        check('name')
            .not()
            .isEmpty(),
        check('country')
            .not()
            .isEmpty()
    ], 
    adminsController.createClub
);

router.patch(
    '/:cid', 
    [
        check('name')
            .not()
            .isEmpty(),
        check('country')
            .not()
            .isEmpty()
    ], 
    adminsController.updateClub
);

router.delete('/:cid', adminsController.deleteClub);

router.get('/', adminsController.getUsers);

module.exports = router;