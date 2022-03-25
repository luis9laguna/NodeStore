//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');
const rateLimit = require("express-rate-limit");

//FUNCTIONS
const { getAddressesByUser,
    getAddressByID,
    createAddress,
    updateAddress,
    makeAddressDefault,
    deleteAddress } = require('../controllers/address');
const { checkParams } = require('../middlewares/check-params');
const { checkJWT } = require('../middlewares/check-jwt');

//CODE
const router = Router();
const addressLimitter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: {
        code: 429,
        message: "Too many requests, wait for a moment"
    }
});

//GET ALL BY USER
router.get('/', checkJWT, getAddressesByUser);

//GET BY ID
router.get('/:id', getAddressByID);

//POST
router.post('/',
    [addressLimitter,
        check('address.name', 'Name is required').not().isEmpty().trim().escape(),
        check('address.phone', 'Phone is required').not().isEmpty().trim().escape(),
        check('address.id', 'ID is required').not().isEmpty().trim().escape(),
        check('address.state', 'State is required').not().isEmpty().trim().escape(),
        check('address.city', 'City is required').not().isEmpty().trim().escape(),
        check('address.province', 'Province is required').not().isEmpty().trim().escape(),
        check('address.street', 'Street is required').not().isEmpty().trim().escape(),
        check('address.numstreet', 'Numstreet is required').not().isEmpty().trim().escape(),
        checkParams
    ], createAddress);

//PUT
router.put('/:id',
    [checkJWT,
        check('address.name', 'Name is required').not().isEmpty().trim().escape(),
        check('address.phone', 'Phone is required').not().isEmpty().trim().escape(),
        check('address.id', 'ID is required').not().isEmpty().trim().escape(),
        check('address.state', 'State is required').not().isEmpty().trim().escape(),
        check('address.city', 'City is required').not().isEmpty().trim().escape(),
        check('address.province', 'Province is required').not().isEmpty().trim().escape(),
        check('address.street', 'Street is required').not().isEmpty().trim().escape(),
        check('address.numstreet', 'Numstreet is required').not().isEmpty().trim().escape(),
        checkParams
    ], updateAddress);

//MAKE ADDRESS DEFAULT
router.put('/default/:id', checkJWT, makeAddressDefault);

//DELETE
router.delete('/:id', checkJWT, deleteAddress);

module.exports = router;