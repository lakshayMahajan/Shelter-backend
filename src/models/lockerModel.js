const mongoose = require('mongoose');

const lockerSchema = new mongoose.Schema({
    locker_id: {
        type: String,
        required: true,
        unique: true
    },
    combo: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    availability: {
        type: Date,
        required: true
    }
});

const Locker = mongoose.model('Locker', lockerSchema);

module.exports = Locker;
