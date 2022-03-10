//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');

//FUNCTIONS
const { getCategories,
    getProductsByCategory,
    createCategory,
    updateCategory,
    deleteCategory } = require('../controllers/categories');
const { checkParams } = require('../middlewares/check-params');
const { checkJWT, checkSuper } = require('../middlewares/check-jwt');

//CODE
const router = Router();

//GET
router.get('/', getCategories);

//GET PRODUCTS BY CATEGORY
router.get('/:slug', getProductsByCategory);

//POST
router.post('/', [
    checkJWT,
    checkSuper,
    check('name', 'Name is required').not().isEmpty().trim().escape(),
    checkParams
],
    createCategory);

//PUT
router.put('/:id', [
    checkJWT,
    checkSuper,
    check('name', 'Name is required').not().isEmpty().trim().escape(),
    checkParams
], updateCategory);

//DELETE
router.delete('/:id', deleteCategory);

module.exports = router;