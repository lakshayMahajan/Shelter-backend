const mongoose = require('mongoose');
const Locker = require('./lockerModel'); // Import the Locker model

const formSubmissionSchema = new mongoose.Schema({
    categories: [{
        type: String,
        required: true
    }],
    note: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        default: false // Default value is false
    },
    date: {
        type: Date,
        required: false
    },
    locker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Locker', // Reference to the Locker model
        required: false
    },
    user: {
        type: String,
        required: true
    }
});

const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

module.exports = FormSubmission;
