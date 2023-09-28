const express = require('express');
const productRoutes = express.Router();
const Product = require('../models/productModel');
const Locker = require('../models/lockerModel');
const Category = require('../models/categoryModel');
const FormData = require('../models/formSubmissionModel');

//Gets a category
productRoutes.post('/', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Please provide a category name." });
    }

    try {
        const category = await Category.create({ name });
        res.status(201).json(category);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

productRoutes.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

productRoutes.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found." });
        }
        res.status(200).json({ message: "Category deleted successfully." });
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

//locker routes

productRoutes.get('/random-locker', async(req, res) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // set the time to 00:00:00

    try {
        // Find lockers with no availability date or a past availability date
        const lockers = await Locker.find({
            $or: [
                { availability: { $exists: false } },
                { availability: { $lte: currentDate } }
            ]
        });

        if (!lockers || lockers.length === 0) {
            return res.status(404).json({ message: "No available lockers found." });
        }

        // Select a random locker from the available lockers
        const randomLocker = lockers[Math.floor(Math.random() * lockers.length)];
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
        // Using _id to find the locker
        const updatedLocker = await Locker.findByIdAndUpdate(
            lockerId, 
            { availability: new Date(newDate) }, // convert newDate to a Date object
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

productRoutes.get('/getForm/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        console.log(userId);
        const forms = await FormData.find({ user: userId });

        if (!forms || forms.length === 0) {
            return res.status(404).json({ message: "No forms found for the given user." });
        }

        res.status(200).json(forms);
    } catch (err) {
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