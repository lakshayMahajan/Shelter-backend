const express = require('express');
const productRoutes = express.Router();
const Product = require('../models/productModel');


//creates a product
productRoutes.post('/', async(req, res) => {
    const { name, quantity, category, image, tags } = req.body;

    // Validation for required fields
    if (!name || !quantity || !category || !image || !tags) {
        return res.status(400).json({ message: "Please fill out all required fields." });
    }

    try {
        const product = await Product.create(req.body);
        res.status(200).json(product)
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send(err.message) // Notice that I've changed `error.message` to `err.message` to reference the correct error object.
    }
});


//gets all products
productRoutes.get('/', async(req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);   
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send(err.message); // Fixed the reference to the error object.
    }
});


//gets a product by id
productRoutes.get('/:id', async(req, res) => {
    try {
        const  {id} = req.params;
        const product = await Product.findById(id);
        
        if(!product) {
            res.status(404).send('Product not found with that id')
        }
        res.status(200).json(product)
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send(error.message)
    }
})

//update a product by id
productRoutes.put('/:id', async(req, res) => {
    try {
        const  {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        
        if(!product) {
            res.status(404).send('product not found with that id')
        }
        res.status(200).json(product)
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send(error.message)
    }
})

//delete a product by id

productRoutes.delete('/products/:id', async(req, res) => {
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product) {
            res.status(404).send('product not found with that id')
        }
        res.status(200).json(product)
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send(error.message)
    }

})

module.exports = productRoutes;