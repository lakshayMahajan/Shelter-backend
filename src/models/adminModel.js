const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    msId: {
        type: String,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true
    },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
