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
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;