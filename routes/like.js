//REQUIRED
const { Router } = require('express');

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
router.post('/:id', checkJWT, giveLikeAndDislike);


module.exports = router;