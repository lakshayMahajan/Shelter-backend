const express = require('express');
const productRoutes = express.Router();
const Product = require('../models/productModel');
const Locker = require('../models/lockerModel');


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

//locker routes

productRoutes.get('/random-locker', async(req, res) => {
    const currentDate = new Date();
    let queryDate;

    if (currentDate.getHours() >= 15) { // If it's past 3 PM
        queryDate = currentDate;
    } else {
        currentDate.setDate(currentDate.getDate() - 1); // Set to yesterday
        queryDate = currentDate;
    }

    // Convert to YYYY-MM-DD format for comparison
    const formattedDate = `${queryDate.getFullYear()}-${String(queryDate.getMonth() + 1).padStart(2, '0')}-${String(queryDate.getDate()).padStart(2, '0')}`;

    try {
        const lockers = await Locker.find({ availability: { $lte: formattedDate } }); // Find lockers with availability less than or equal to the query date

        if (!lockers || lockers.length === 0) {
            return res.status(404).json({ message: "No available lockers found." });
        }

        const randomLocker = lockers[Math.floor(Math.random() * lockers.length)]; // Select a random locker

        res.status(200).json(randomLocker);
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

productRoutes.put('/update-locker-date/:lockerId', async(req, res) => {
    const { lockerId } = req.params;
    const { newDate } = req.body;

    // Validation for the new date
    if (!newDate) {
        return res.status(400).json({ message: "Please provide a new date." });
    }

    try {
        const updatedLocker = await Locker.findOneAndUpdate(
            { locker_id: lockerId }, 
            { availability: newDate }, 
            { new: true } // This option returns the updated document
        );

        if (!updatedLocker) {
            return res.status(404).json({ message: "Locker not found." });
        }

        res.status(200).json(updatedLocker);
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
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