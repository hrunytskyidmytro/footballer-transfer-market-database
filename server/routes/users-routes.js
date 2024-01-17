const express = require('express');

const router = express.Router();

router.get('/user', (req, res, next) => {
    res.json({ message: 'User routes!' });
});

module.exports = router;