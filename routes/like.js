//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');

//FUNCTIONS
const { getLikesByUser,
    giveLike,
    giveDislike } = require('../controllers/like');
const { checkParams } = require('../middlewares/check-params');
const { checkJWT, checkSuper } = require('../middlewares/check-jwt');

//CODE
const router = Router();


//GET PRODUCT BY CATEGORY
router.get('/:id', getLikesByUser);

//GIVE A LIKE
router.post('/', giveLike);

//GIVE A DISLIKE
router.delete('/:id', giveDislike);

module.exports = router;