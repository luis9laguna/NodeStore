//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');

//FUNCTIONS
const { getAddressesByUser,
    createAddress,
    updateAddress,
    deleteAddress } = require('../controllers/address');
const { checkParams } = require('../middlewares/check-params');
const { checkJWT } = require('../middlewares/check-jwt');

//CODE
const router = Router();

//GET
router.get('/:id', getAddressesByUser);

//POST
router.post('/',
[ checkJWT,
    check('user', 'User is required').isMongoId(),
    check('address.phone', 'Phone is required').not().isEmpty(),
    check('address.state', 'State is required').not().isEmpty(),
    check('address.city', 'City is required').not().isEmpty(),
    check('address.province', 'Province is required').not().isEmpty(),
    check('address.street', 'Street is required').not().isEmpty(),
    check('address.numstreet', 'Numstreet is required').not().isEmpty(),
    checkParams
], createAddress);

//PUT
router.put('/:id',
[ checkJWT,
    check('address.phone', 'Phone is required').not().isEmpty(),
    check('address.state', 'State is required').not().isEmpty(),
    check('address.city', 'City is required').not().isEmpty(),
    check('address.province', 'Province is required').not().isEmpty(),
    check('address.street', 'Street is required').not().isEmpty(),
    check('address.numstreet', 'Numstreet is required').not().isEmpty(),
    checkParams
], updateAddress);

//DELETE
router.delete('/:id',checkJWT, deleteAddress);

module.exports = router;