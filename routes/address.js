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
    max: 5000,
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
        check('address.rut', 'RUT is required').not().isEmpty().trim().escape(),
        check('address.region', 'Region is required').not().isEmpty().trim().escape(),
        check('address.provincia', 'Provincia is required').not().isEmpty().trim().escape(),
        check('address.comuna', 'Comuna is required').not().isEmpty().trim().escape(),
        check('address.street', 'Street is required').not().isEmpty().trim().escape(),
        check('address.numStreet', 'NumStreet is required').not().isEmpty().trim().escape(),
        checkParams
    ], createAddress);

//PUT
router.put('/:id',
    [checkJWT,
        check('address.name', 'Name is required').not().isEmpty().trim().escape(),
        check('address.phone', 'Phone is required').not().isEmpty().trim().escape(),
        check('address.rut', 'RUT is required').not().isEmpty().trim().escape(),
        check('address.region', 'Region is required').not().isEmpty().trim().escape(),
        check('address.provincia', 'Provincia is required').not().isEmpty().trim().escape(),
        check('address.comuna', 'Comuna is required').not().isEmpty().trim().escape(),
        check('address.street', 'Street is required').not().isEmpty().trim().escape(),
        check('address.numStreet', 'NumStreet is required').not().isEmpty().trim().escape(),
        checkParams
    ], updateAddress);

//MAKE ADDRESS DEFAULT
router.put('/default/:id', checkJWT, makeAddressDefault);

//DELETE
router.delete('/:id', checkJWT, deleteAddress);

module.exports = router;