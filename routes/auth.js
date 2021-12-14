//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');

//FUNCTIONS
const { login,
    googleSignIn,
    forgetEmail,
    resetPassword } = require('../controllers/auth');
const { checkParams } = require('../middlewares/check-params');

//CODE
const router = Router();

//STANDARD
router.post('/login',
    [
        check('email', 'Email is required').isEmail(),
        check('password', 'Password is required').not().isEmpty(),
        checkParams
    ],
    login);



//GOOGLE
router.post('/google',
    [
        check('token', 'Token is required').not().isEmpty(),
        checkParams
    ],
    googleSignIn);

//PETITION RESET PASSWORD
router.post('/password-reset', forgetEmail);


//RESET PASSWORD
router.put('/password-reset/:token', resetPassword);

module.exports = router;