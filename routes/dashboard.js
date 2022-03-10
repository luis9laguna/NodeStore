//REQUIRED
const { Router } = require('express');

//FUNCTIONS
const { getAllProductsDashboard,
    getCategoriesDashboard,
    getProductsByCategoryDashboard,
    getSearchDashboard } = require('../controllers/dashboard');
const { checkJWT, checkSuper } = require('../middlewares/check-jwt');

//CODE
const router = Router();


//GET ALL PRODUCTS
router.get('/products', [checkJWT, checkSuper], getAllProductsDashboard);

//GET ALL PRODUCTS
router.get('/categories', [checkJWT, checkSuper], getCategoriesDashboard);

//GET ALL PRODUCTS
router.get('/productsbycategory/:id', [checkJWT, checkSuper], getProductsByCategoryDashboard);

//GET ALL PRODUCTS
router.get('/search/:term', [checkJWT, checkSuper], getSearchDashboard);

module.exports = router;


