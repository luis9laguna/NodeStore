//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');

//FUNCTIONS
const { getProduct,
    getProductByID,
    createProduct,
    updateProduct,
    deleteProduct } = require('../controllers/products');
const { checkParams } = require('../middlewares/check-params');
const { checkJWT, checkSuper } = require('../middlewares/check-jwt');

//CODE
const router = Router();

//GET
router.get('/', getProduct);

//GET PRODUCT BY ID

router.get('/:id', getProductByID);

//POST
router.post('/',
[ checkJWT,
    checkSuper, 
    check('name', 'Name is required').not().isEmpty(),
    check('category', 'Category is required').isMongoId(),
    check('description', 'Description is required').not().isEmpty(),
    check('cost', 'Cost is required').not().isEmpty(),
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
    check('cost', 'Cost is required').not().isEmpty(),
    check('price', 'Price is required').not().isEmpty(),
    check('stock', 'Stock is required').not().isEmpty(),
    checkParams
], updateProduct);

//DELETE
router.delete('/:id', deleteProduct);


module.exports = router;