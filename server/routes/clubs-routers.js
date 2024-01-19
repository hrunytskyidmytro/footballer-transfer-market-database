const express = require('express');
const { check } = require('express-validator');

const clubsController = require('../controllers/clubs-controllers');

const router = express.Router();

router.get('/', clubsController.getClubs);

router.get('/:cid', clubsController.getClubById);

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
    clubsController.createClub
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
    clubsController.updateClub
);

router.delete('/:cid', clubsController.deleteClub);

module.exports = router;