const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    },
    dateScheduled: {
        type: Date,
        require: false
    },
    dateOrdered: {
        type: Date,
        require: false
    },
    cart : {
        type: Array,
        ref: 'Product',
        require: false
    },
    orders: {
        type: Array,
        ref: 'Product',
        require: false
    },
    approved: {
        type: Boolean,
        require: false
    },
    role : {
        type: String,
        require: false
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;