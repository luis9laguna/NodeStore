//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');
const fileUpload = require('express-fileupload');

//FUNCTIONS
const { updateImage, 
    uploadGallery, 
    DeletePhotoGallery, 
    getGalleryByProduct } = require('../controllers/upload');
const { checkImage } = require('../middlewares/check-image');
const { checkJWT, checkSuper } = require('../middlewares/check-jwt');


//CODE
const router = Router();
router.use( fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
    createParentPath: true
}));

//ROUTES

//GET GALLERY BY PRODUCT
router.get('/:id', getGalleryByProduct)

//UPDATE PHOTO OF PRODUCT OR CATEGORY
router.post('/:collection/:id', [
    checkJWT,
    checkSuper,
    checkImage] , updateImage);

//POST GALLERY PHOTO PRODUCT
router.post('/:id',[
    checkJWT,
    checkSuper,
    checkImage], uploadGallery);

//DELETE PHOTO OF A PRODUCT
router.delete('/:id',[
    checkJWT,
    checkSuper], DeletePhotoGallery);
  

module.exports = router;