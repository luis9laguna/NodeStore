//REQUIRED
const { Router } = require('express');

//FUNCTIONS
const { uploadImage, deleteImage } = require('../controllers/upload');
const { checkImage } = require('../middlewares/check-image');
const { checkJWT, checkSuper } = require('../middlewares/check-jwt');


//CODE
const router = Router();

//ROUTES

//POST PHOTO
router.post('/', [
    checkJWT,
    checkSuper,
    checkImage], uploadImage);


//DELETE PHOTO OF A PRODUCT
router.post('/delete', [
    checkJWT,
    checkSuper], deleteImage);


module.exports = router;