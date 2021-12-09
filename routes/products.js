//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');

//FUNCTIONS
const { getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    likeProduct } = require('../controllers/products');
const { checkParams } = require('../middlewares/check-params');
const { checkJWT, checkSuper } = require('../middlewares/check-jwt');

//CODE
const router = Router();

//GET
router.get('/', getProduct);

//POST
router.post('/',
[ checkJWT,
    checkSuper, 
    check('name', 'Name is required').not().isEmpty(),
    check('category', 'Category is required').isMongoId(),
    check('description', 'Description is required').not().isEmpty(),
    check('price', 'Price is required').not().isEmpty(),
    check('stock', 'Stock is required').not().isEmpty(),
    checkParams
], createProduct);

//PUT
router.put('/:id',
[ checkJWT,
    checkSuper, 
    check('name', 'Name is required').not().isEmpty(),
    check('category', 'Category is required').isMongoId(),
    check('description', 'Description is required').not().isEmpty(),
    check('price', 'Price is required').not().isEmpty(),
    check('stock', 'Stock is required').not().isEmpty(),
    checkParams
], updateProduct);

//DELETE
router.delete('/:id', deleteProduct);


module.exports = router;