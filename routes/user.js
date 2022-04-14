//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');
const rateLimit = require("express-rate-limit");

//FUNCTIONS
const { getUser, getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/user');
const { checkParams } = require('../middlewares/check-params');
const { checkJWT, checkSuper, checkAdmin } = require('../middlewares/check-jwt');

//CODE
const router = Router();
const registerLimitter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 2,
    message: {
        code: 429,
        message: "Too many requests, wait for a moment"
    }
});

//GET USER
router.get('/', checkJWT, getUser);

//GET ALL
router.get('/all', [checkJWT, checkAdmin], getAllUsers);

//POST
router.post('/',
    [
        registerLimitter,
        check('name', 'Name is required').not().isEmpty().trim().escape(),
        check('lastname', 'Lastname is required').not().isEmpty().trim().escape(),
        check('password', 'Password is required').not().isEmpty().trim().escape().isLength({ min: 6 }),
        check('email', 'Email is required').isEmail().normalizeEmail(),
        checkParams
    ],
    createUser);

//PUT
router.put('/',
    [
        checkJWT,
        check('name', 'Name is required').not().isEmpty().trim().escape(),
        check('lastname', 'Lastname is required').not().isEmpty().trim().escape(),
        checkParams
    ],
    updateUser);

//DELETE
router.delete('/:id',
    [
        checkJWT,
        checkSuper
    ], deleteUser);


module.exports = router;