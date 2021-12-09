//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');

//FUNCTIONS
const { getAdmins, createAdmin, updateAdmin, deleteAdmin } = require('../controllers/admin');
const { checkParams } = require('../middlewares/check-params');
const { checkJWT, checkSuper } = require('../middlewares/check-jwt');
//CODE
const router = Router();


//GET Admins
router.get('/', [checkJWT, checkSuper], getAdmins);


//POST
router.post('/',
    [
        checkJWT,
        checkSuper,
        check('name', 'Name is required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        checkParams
    ],
    createAdmin);


//PUT
router.put('/:id',
    [
        checkJWT,
        checkSuper,
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        checkParams
    ],
    updateAdmin);


//DELETE
router.delete('/:id',
    [
        checkJWT,
        checkSuper
    ], deleteAdmin);


module.exports = router;