//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');
const rateLimit = require("express-rate-limit");

//FUNCTIONS
const { login,
    googleSignIn,
    changePassword,
    forgetEmail,
    resetPassword } = require('../controllers/auth');
const { checkParams } = require('../middlewares/check-params');
const { checkJWT } = require('../middlewares/check-jwt');

//CODE
const router = Router();

//LIMIT OF REQUEST
const loginLimitter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message:{
        code: 429,
        message: "Too many tries to enter to this account wait for a moment"
    }
});

const forgotLimitter = rateLimit({
    windowMs: 30 * 1000,
    max: 1,
    message:{
        code: 429,
        message: "Wait for a moment before trying again"
    }
});

//STANDARD
router.post('/login',
    [
        loginLimitter,
        check('email', 'Email is required').isEmail().normalizeEmail(),
        check('password', 'Password is required').not().isEmpty().trim().escape(),
        checkParams
    ],
    login);

//GOOGLE
router.post('/google',
    [
        check('token', 'Token is required').not().isEmpty().trim().escape(),
        checkParams
    ],
    googleSignIn);


//CHANGE PASSWORD WITH LOGIN
router.put('/change-password',
    [   checkJWT,
        check('oldPassword', 'OldPassword is required').not().isEmpty().trim().escape(),
        check('newPassword', 'NewPassword is required').not().isEmpty().trim().escape(),
        checkParams
    ],
    changePassword);

//PETITION RESET PASSWORD
router.post('/password-reset',
    [
        forgotLimitter,
        check('email', 'Email is required').not().isEmpty().trim().escape(),
        checkParams
    ],
    forgetEmail);


//RESET PASSWORD
router.put('/password-reset/:token',
    [
        check('password', 'Password is required').not().isEmpty().trim().escape(),
        checkParams
    ],
    resetPassword);

module.exports = router;