//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');

//FUNCTIONS
const { getProduct,
    createProduct,
    updateProduct,
    deleteProduct } = require('../controllers/products');

//CODE
const router = Router();

//GET
router.get('/', getProduct);

//POST
router.post('/', createProduct);

//PUT
router.put('/:id', updateProduct);

//DELETE
router.delete('/:id', deleteProduct);

module.exports = router;