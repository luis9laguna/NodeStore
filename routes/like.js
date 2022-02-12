//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');

//FUNCTIONS
const { getLikesByUser,
    giveLikeAndDislike,
    getProductsWithMoreLikes } = require('../controllers/like');
const { checkJWT } = require('../middlewares/check-jwt');

//CODE
const router = Router();


//GET LIKES BY USER
router.get('/', checkJWT, getLikesByUser);

//GET PRODUCTS WITH THE MOST LIKES
router.get('/products', getProductsWithMoreLikes)

//GIVE A LIKE
router.post('/:slug', checkJWT, giveLikeAndDislike);


module.exports = router;