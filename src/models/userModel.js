const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    msId: {
        type: String,
        required: true,
        default: "None",
      },
      name:{
        type: String,
        required: true,
        default: "None"
    },
    orders: {
        type: Array,
        ref: 'Product',
        require: false
    },
    locker: {
        type: String,
        ref: 'Locker',
        required: false,
        default: "None"
    }
    
});

const User = mongoose.model('User', userSchema);

module.exports = User;