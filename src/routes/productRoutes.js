const express = require('express');
const productRoutes = express.Router();
const Product = require('../models/productModel');
const Locker = require('../models/lockerModel');
const Category = require('../models/categoryModel');
const FormData = require('../models/formSubmissionModel');
const Admin = require('../models/adminModel');
const FormSubmission = require('../models/formSubmissionModel');



productRoutes.post('/admin', async (req, res) => {
    const { msId,name } = req.body;

    if (!msId||!name) {
        return res.status(400).json({ message: "Try again later." });
    }
 
    try {
        const admin = await Admin.findOne({ msId });
        if (admin) {
            return res.status(400).json({ message: "Admin already exists." });
        }else{
            const admin = await Admin.create({ msId,name });
            admin.save();
            res.status(201).json(admin);
        }
       
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

productRoutes.get('/admin', async (req, res) => {
    try {
        const categories = await Admin.find();
        res.status(200).json(categories);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});
productRoutes.get('/admin/:id', async (req, res) => {
    try {
        const student =  await Admin.findOne({
            msId: req.params.id,
          })  
        if (!student) {
            return res.status(404);
        }
        res.status(200).json({ found: true, student});
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});
productRoutes.delete('/admin/:id', async (req, res) => {
    try {
        const student = await Admin.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }
        res.status(200).json({ message: "Student deleted successfully." });
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});


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



productRoutes.get('/locker/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const forms = await Locker.find({ user: userId });

        if (!forms || forms.length === 0) {
            return res.status(404).json({ message: "No forms found for the given user." });
        }

        res.status(200).json(forms);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

productRoutes.get('/random-locker', async(req, res) => {
    try {
        // Find lockers where availability is false
        const lockers = await Locker.find({ availability: true });

        if (!lockers || lockers.length === 0) {
            return res.status(404).json({ message: "No available lockers found." });
        }

        // Select a random locker from the available lockers
        const randomLocker = lockers[Math.floor(Math.random() * lockers.length)];

        // Set the availability of the selected locker to false
        randomLocker.availability = false;
        await randomLocker.save();

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
       
        // Use populate to include locker details
        const forms = await FormData.find({ user: userId }).populate('locker');
        console.log(forms);
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
// productRoutes.get('/:id', async(req, res) => {
//     try {
//         const  {id} = req.params;
//         const product = await Product.findById(id);
        
//         if(!product) {
//             res.status(404).send('Product not found with that id')
//         }
//         res.status(200).json(product)
//     }
//     catch (err) {
//         console.log(err.message)
//         res.status(500).send(error.message)
//     }
// })

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

productRoutes.delete('/prod/:id', async(req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        const category = await FormSubmission.findByIdAndDelete(id);
        console.log(category);
        if (!category) {
            return res.status(404).json({ message: "Product not found." });
        }
        res.status(200).json({ message: "Product deleted successfully." });
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }

})

module.exports = productRoutes;