const express = require('express');
const { check } = require('express-validator');

const footballersController = require('../controllers/footballers-controllers');

const router = express.Router();

router.get('/:fid', footballersController.getFootballerById);

router.post(
    '/', 
    [
        check('name')
            .not()
            .isEmpty(),
        check('surname')
            .not()
            .isEmpty(),
        check('dateofbirth')
            .not()
            .isEmpty(),
        check('nationality')
            .not()
            .isEmpty(),
        check('position')
            .not()
            .isEmpty(),
        check('club')
            .not()
            .isEmpty()
    ], 
    footballersController.createFootballer
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
        check('dateofbirth')
            .not()
            .isEmpty(),
        check('nationality')
            .not()
            .isEmpty(),
        check('position')
            .not()
            .isEmpty(),
        check('club')
            .not()
            .isEmpty()
    ], 
    footballersController.updateFootballer
);

router.delete('/:fid', footballersController.deleteFootballer);

module.exports = router;