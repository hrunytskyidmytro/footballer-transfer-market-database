const express = require('express');
const { check } = require('express-validator');

const adminsController = require('../controllers/admins-controllers');

const checkAdmin = require('../middleware/check-admin');

const router = express.Router();

router.get('/footballers/user/:fid', adminsController.getFootballersByUserId);

router.post(
    '/footballer/new', 
    [
        check('name')
            .not()
            .isEmpty(),
        check('surname')
            .not()
            .isEmpty(),
        check('nationality')
            .not()
            .isEmpty(),
        check('position')
            .not()
            .isEmpty()
    ], 
    adminsController.createFootballer
);

router.patch(
    '/footballer/:fid', 
    [
        check('name')
            .not()
            .isEmpty(),
        check('surname')
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

router.delete('/footballer/:fid', adminsController.deleteFootballer);

router.post(
    '/transfer/new',
    [
        check('transferFee')
            .not()
            .isEmpty()
    ], 
    adminsController.createTransfer
);

router.patch(
    '/transfer/:tid',
    [
        check('transferFee')
            .not()
            .isEmpty()
            .isInt(),
        check('transferDate')
            .not()
            .isEmpty(),
        check('transferType')
            .not()
            .isEmpty()
    ],  
    adminsController.updateTransfer
);

router.delete('/transfer/:tid', adminsController.deleteTransfer);

router.post(
    '/club/new/footballer/:fid', 
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
    '/club/:cid', 
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

router.delete('/club/:cid', adminsController.deleteClub);

router.get('/users', adminsController.getUsers);

module.exports = router;