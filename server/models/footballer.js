const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const footballerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    club: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('Footballer', footballerSchema);