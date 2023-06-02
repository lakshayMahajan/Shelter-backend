const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    image : {
        type: String,
        require: true
    },
    tags: {
        type: Array,
        require: true
    },
    description: {
        type: String,
        require: false
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;