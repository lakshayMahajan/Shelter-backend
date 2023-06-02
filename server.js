const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');

app.use(express.json());
app.use("/users",userRoutes)
app.use("/products",productRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!');
    });
mongoose
.connect('mongodb+srv://admin:shelter@roary.m29hu3l.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
.then (() =>

app.listen(4000, () => {
    console.log('Server is listening on port 4000');
  })  
)
.catch(err => console.log(err));