const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: {
        type: [String],
        required: true
    },
    user: {
        type: String,
        required: true
    },
    date: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: false
    },
    approved: {
        type: Boolean,
        require: false
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;