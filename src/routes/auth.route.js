const express = require('express');
const authController = require('../controller/auth.controller');
const { body, validationResult } = require('express-validator');

const router = express.Router();

const registerValidation = [
    body('userName')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Enter a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
    body('password')
        .notEmpty().withMessage('Password is required')
];

router.post('/register', registerValidation, authController.registerUser);
router.post('/login', loginValidation, authController.loginUser);
router.post('/logout', authController.logOutUser);

module.exports = router;