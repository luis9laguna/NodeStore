//REQUIRED
const { Router } = require('express');
const fileUpload = require('express-fileupload');

//FUNCTIONS
const { uploadImage, deleteImage } = require('../controllers/upload');
const { checkImage } = require('../middlewares/check-image');
const { checkJWT, checkSuper } = require('../middlewares/check-jwt');


//CODE
const router = Router();
router.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true
}));

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