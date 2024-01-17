const express = require('express');

const footballersControllers = require('../controllers/footballers-controllers');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.json({ message: 'Footballers page!' });
});

router.get('/:fid', footballersControllers.getFootballerById);

router.post('/newfootballer', );

router.patch('/:fid', );

router.delete('/:fid', );

module.exports = router;