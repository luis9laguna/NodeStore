//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');

//FUNCTIONS
const { getAllProducts,
    getNewestProduct,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    checkStock,
    updateStock } = require('../controllers/products');
const { checkParams } = require('../middlewares/check-params');
const { checkJWT, checkSuper, checkAdmin } = require('../middlewares/check-jwt');

//CODE
const router = Router();

//GET ALL
router.get('/', getAllProducts);

//GET NEWEST PRODUCTS
router.get('/newest', getNewestProduct);

//GET PRODUCT BY SLUG
router.get('/:slug', getProductBySlug);

//POST
router.post('/',
    [checkJWT,
        checkSuper,
        check('name', 'Name is required').not().isEmpty().trim().escape(),
        check('category', 'Category is required').isMongoId(),
        check('description', 'Description is required').not().isEmpty().trim().escape(),
        check('cost', 'Cost is required').not().isEmpty().trim().escape(),
        check('price', 'Price is required').not().isEmpty().trim().escape(),
        check('stock', 'Stock is required').not().isEmpty().trim().escape(),
        checkParams
    ], createProduct);

//PUT
router.put('/:id',
    [
        checkJWT,
        checkSuper,
        check('name', 'Name is required').not().isEmpty().trim().escape(),
        check('category', 'Category is required').isMongoId(),
        check('description', 'Description is required').not().isEmpty().trim().escape(),
        check('cost', 'Cost is required').not().isEmpty().trim().escape(),
        check('price', 'Price is required').not().isEmpty().trim().escape(),
        check('stock', 'Stock is required').not().isEmpty().trim().escape(),
        checkParams
    ], updateProduct);

//DELETE
router.delete('/:id', deleteProduct);

//CHECKSTOCK
router.get('/stock/:slug', checkStock)


//CHECKSTOCK
router.put('/stock/:id',
    [
        checkJWT,
        checkAdmin,
        check('stock', 'Stock is required').not().isEmpty(),
    ], updateStock)


module.exports = router;