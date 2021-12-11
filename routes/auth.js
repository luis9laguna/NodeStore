//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');

//FUNCTIONS
const { login,
    googleSignIn,
    forgetEmail,
    resetPassword } = require('../controllers/auth');
const { checkParams } = require('../middlewares/check-params');
const { checkJWT } = require('../middlewares/check-jwt');

//CODE
const router = Router();

//STANDARD
router.post('/',
    [
        check('password', 'Password is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
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
router.post('/password-reset/:id/:token', resetPassword);

module.exports = router;