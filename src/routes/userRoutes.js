const express = require('express');
const router = express.Router()
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const FormSubmission = require('../models/formSubmissionModel');
const { signUp, signIn } = require('../controller/userController');
const auth  = require('../middleware/auth');




router.post("/", auth(), async (req,res)=>{
    
    const {requester} = res.locals

    try{
      const orderData = await User.findOne({
        msId: requester.user.localAccountId,
      })  
      console.log(orderData);
      // const adminData = await User.findOne({
      //   email: requester.user.localAccountId,
      // })
  

      if(orderData){
        return res.json({...requester, orderData})
      } else {
        const newUser = new User({ msId: requester.user.localAccountId, name: requester.user.name });
        console.log(newUser);
        newUser.save();
        return res.json({...requester, newUser})
      }

    } catch(err){
      console.log(err)
      return res.json({'errors': [{"msg": "Server Error"}]}).status(500)
    }
    

})
router.get("/users", auth(), async (req,res)=>{

  const {requester} = res.locals
  try{
    const userData = await User.find()
    return res.status(200).json(userData)
  } catch(err){
    console.log(err)
    return res.json({'errors': [{"msg": "Server Error"}]}).status(500)
  }


})
router.post('/createForm', async (req, res) => {
  const { categories, note, user,date,locker } = req.body;
  const nameGen = await User.findOne({
    msId: user,
  }) 

  

  if (!categories || categories.length === 0 || !note) {
      return res.status(400).json({ message: "Please provide categories and a note." });
  }

  try {
      const formSubmission = await FormSubmission.create({ categories, note, user,date,locker });
      res.status(201).json(formSubmission);
  } catch (err) {
      console.log(err.message);
      res.status(500).send(err.message);
  }
});

router.get('/forms', async (req, res) => {
  try {
      // Fetch all form submissions and populate 'locker' field
      let formSubmissions = await FormSubmission.find().populate('locker');

      // Convert formSubmissions to a plain JavaScript object array to modify
      formSubmissions = formSubmissions.map(submission => submission.toObject());

      // Fetch and attach user details for each form submission
      const submissionsWithUsers = await Promise.all(formSubmissions.map(async (submission) => {
          const user = await User.findOne({ msId: submission.user }).lean(); // Use .lean() for performance if you only need plain JavaScript objects
          if (user) {
              submission.userDetails = user; // Attach user details
          } else {
              submission.userDetails = null; // Or handle how you prefer if user not found
          }
          return submission;
      }));

      res.status(200).json(submissionsWithUsers);
  } catch (err) {
      console.log(err.message);
      res.status(500).send(err.message);
  }
});



router.patch('/forms/:id', async (req, res) => {
  const { id } = req.params;
  const { date, approved, locker,note,teacherNote } = req.body;

  try {
    console.log(id);
    const updatedForm = await FormSubmission.findByIdAndUpdate(
      id,
      { date, approved, locker,note,teacherNote },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: 'Form not found.' });
    }

    res.status(200).json(updatedForm);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});
router.patch('/forms/teacher/:id', async (req, res) => {
  const { id } = req.params;
  const { date, approved, locker,teacherNote } = req.body;

  try {
    console.log(id);
    const updatedForm = await FormSubmission.findByIdAndUpdate(
      id,
      { date, approved, locker,teacherNote },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: 'Form not found.' });
    }

    res.status(200).json(updatedForm);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

router.post('/order', async(req, res) => {
    const { items, user, date, status, approved, order } = req.body;

    // Validation for required fields
    if (!items || !user || !date ) {
        return res.status(400).json({ message: "Please fill out all required fields." });
    }

    try {
        // Check if user exists
        const userExists = await User.findOne({ msId: user });
        if (!userExists) {
            return res.status(400).json({ message: "User not found." });
        }

        // Create a new order
        const newOrder = new Order({
            items,
            user,
            date,
            status: status || "Pending", // Assuming "Pending" as default status if none is provided
            approved: approved || false, // Assuming false as default if none is provided
          
        });

        const savedOrder = await newOrder.save();

        // Optionally: Add the order ID to the user's list of orders if necessary
        userExists.orders.push(savedOrder._id);
        await userExists.save();

        res.status(200).json(savedOrder);
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

// //creates a user
// router.post("/", auth(), async (req,res)=>{
    
//     const {requester} = res.locals

//     try{
//       const clubData = await User.findOne({
//         msId: requester.user.localAccountId,
//       }) 
    

//       if(clubData){


//         return res.json({...requester, clubData})
//       } else {
//         const newUser = new User({ msId: requester.user.localAccountId, name: requester.user.name });
//         console.log(newUser);
//         newUser.save();
//         return res.json({...requester, newUser})
//       }

//     } catch(err){
//       console.log(err)
//       return res.json({'errors': [{"msg": "Server Error"}]}).status(500)
//     }
    

// })

// //gets all users
// userRoutes.get('/', auth(), async(req, res) => {
//     try {
//         const users = await User.find({});
//         res.status(200).json(users)
    
//     }
//     catch (err) {
//         console.log(err.message)
//         res.status(500).send(error.message)
//     }
// })

// //gets a user by id
// userRoutes.get('/:id',auth(), async(req, res) => {
//     try {
//         const  {id} = req.params;
//         const users = await User.findById(id);
//         res.status(200).json(users)
    
//     }
//     catch (err) {
//         console.log(err.message)
//         res.status(500).send(error.message)
//     }
// })

// //update a user by id
// userRoutes.put('/:id',auth(), async(req, res) => {
//     try {
//         const  {id} = req.params;
//         const users = await User.findByIdAndUpdate(id, req.body);
        
//         if(!users) {
//             res.status(404).send('User not found with that id')
//         }
//         res.status(200).json(users)
//     }
//     catch (err) {
//         console.log(err.message)
//         res.status(500).send(error.message)
//     }
// })

module.exports = router;