const userModel = require('../model/user.model');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


async function registerUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg  // Returns first error
        });
    }
    const { userName, email, password } = req.body;

    const isCredentialExists = await userModel.findOne({
        $or: [
            { email },
            { userName }
        ]
    })

    if (isCredentialExists) {
        return res.status(401).json({
            message: 'Username or Email already exists'
        })
    }

    const hash = await bcrypt.hash(password, 10);

    try {

        const user = await userModel.create({
            userName,
            email,
            password: hash
        })

        try {

            const token = jwt.sign({
                id: user._id
            }, process.env.JWT_SECRET);

            res.cookie('token', token);

        } catch (err) {

            console.log('Error creating token:', err);

            return res.status(503).json({
                message: 'Failed to create Token'
            })
        }

        res.status(201).json({
            message: 'User Registered successfully'
        })
    } catch (err) {

        console.log('Error in registration of user:', err);

        return res.status(503).json({
            message: 'User registration failed'
        });
    }
}

async function loginUser(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg
        });
    }
    const { userName, email, password } = req.body;

    const user = await userModel.findOne({
        $or: [
            { userName },
            { email }
        ]
    })

    if (!user) {
        return res.status(401).json({
            message: "User doesn't exists"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(403).json({
            message: 'Pasword is incorrect'
        })
    }

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET);

    res.cookie('token', token);

    res.status(200).json({
        message: 'Logged In successfully'
    });
}

async function logOutUser(req, res) {
    res.clearCookie('token');
    res.status(200).json({
        message: 'User Logged Out'
    })
}

module.exports = { registerUser, loginUser, logOutUser };