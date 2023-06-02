const express = require('express');
const userRoutes = express.Router();
const User = require('../models/userModel');
const { signUp, signIn } = require('../controller/userController');
const auth  = require('../middleware/auth');


userRoutes.use(express.json());


userRoutes.post('/signup', signUp )


userRoutes.post('/signin', signIn )

// //creates a user
// userRoutes.post('/', async(req, res) => {
//     try {
//         const user = await User.create(req.body);
//         res.status(200).json(user)

//     }
//     catch (err) {
//         console.log(err.message)
//         res.status(500).send(error.message)
//     }
// })

//gets all users
userRoutes.get('/', auth, async(req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users)
    
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send(error.message)
    }
})

//gets a user by id
userRoutes.get('/:id',auth, async(req, res) => {
    try {
        const  {id} = req.params;
        const users = await User.findById(id);
        res.status(200).json(users)
    
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send(error.message)
    }
})

//update a user by id
userRoutes.put('/:id',auth, async(req, res) => {
    try {
        const  {id} = req.params;
        const users = await User.findByIdAndUpdate(id, req.body);
        
        if(!users) {
            res.status(404).send('User not found with that id')
        }
        res.status(200).json(users)
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send(error.message)
    }
})

module.exports = userRoutes;