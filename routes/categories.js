//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');

//FUNCTIONS
const { getCategory,
    getProductByCategory,
    createCategory,
    updateCategory,
    deleteCategory } = require('../controllers/categories');

//CODE
const router = Router();

//GET
router.get('/', getCategory);

//GET PRODUCT BY CATEGORY
router.get('/:id', getProductByCategory);

//POST
router.post('/', createCategory);

//PUT
router.put('/:id', updateCategory);

//DELETE
router.delete('/:id', deleteCategory);

module.exports = router;