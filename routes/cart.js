//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');

//FUNCTIONS
const { getCart,
    createCart,
    updateCart,
    deleteCart } = require('../controllers/cart');
const { checkParams } = require('../middlewares/check-params');
const { checkJWT } = require('../middlewares/check-jwt');

//CODE
const router = Router();

//GET
router.get('/:id', getCart);

//POST
router.post('/',
[ checkJWT,
    check('user', 'User is required').isMongoId(),
    check('products.[0].product', 'Product is required').isMongoId(),
    check('products.[0].quantity', 'Quantity is required').not().isEmpty(),
    checkParams
], createCart);

//PUT
router.put('/:id',
[ checkJWT,
    check('user', 'User is required').isMongoId(),
    check('products.[0].product', 'Product is required').isMongoId(),
    check('products.[0].quantity', 'Quantity is required').not().isEmpty(),
    checkParams
], updateCart);

//DELETE
router.delete('/:id',checkJWT, deleteCart);

module.exports = router;