//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');

//FUNCTIONS
const { getLikesByUser,
    giveLike,
    giveDislike,
    likesProduct } = require('../controllers/like');
const { checkParams } = require('../middlewares/check-params');
const { checkJWT } = require('../middlewares/check-jwt');

//CODE
const router = Router();


//GET LIKES BY USER
router.get('/:id',checkJWT, getLikesByUser);

//GIVE A LIKE
router.post('/', [
    checkJWT,
    check('user', 'User is required').isMongoId(),
    check('product', 'Product is required').isMongoId(),
    checkParams
], giveLike);

//GIVE A DISLIKE
router.delete('/:id',checkJWT, giveDislike);

//TOTAL LIKES OF A PRODUCT
router.get('/total/:id', likesProduct);

module.exports = router;