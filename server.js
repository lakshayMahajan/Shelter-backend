const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./src/routes/UserRoutes');
const productRoutes = require('./src/routes/productRoutes');
const cors = require('cors');
const bodyParser = require('body-parser');

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/user",userRoutes)
app.use("/products",productRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!');
    });
mongoose
.connect('mongodb+srv://admin:shelter@roary.m29hu3l.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
.then (() =>

app.listen(port, () => {
    console.log('Server is listening on port 4000');
  })  
)
.catch(err => console.log(err));