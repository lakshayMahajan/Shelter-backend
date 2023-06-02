const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const signUp = async (req, res) => {

    const { email, password } = req.body;

    try {
        const existingUser = await userModel.findOne({ email:email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await userModel.create({ email: email, password: hashedPassword });
        const token = jwt.sign({ email: result.email, id: result._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.status(200).json({ result: result, token: token })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send(error.message)
    }
}

const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await userModel.findOne({ email:email });

        if (!existingUser) {
            return res.status(400).json({ message: "User doesn't exist" })
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.status(200).json({ result: existingUser, token: token })

    } catch (err) {
        console.log(err.message)
        res.status(500).send(error.message)

    }


}


module.exports = { signUp, signIn }