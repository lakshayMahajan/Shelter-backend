const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {


    try {
        let token= req.headers.authorization.split(' ')[1];
        if(!token) {

            return res.status(401).send('Unauthorized')
        }
        let user = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = userId;
        next();
    } 
   

    catch (err) {

        console.log(err.message)
        res.status(500).send(error.message)
    }
}

module.exports = auth;