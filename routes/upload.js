//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');
const fileUpload = require('express-fileupload');

//FUNCTIONS
const { updateImage } = require('../controllers/upload');
const { checkParams } = require('../middlewares/check-params');
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

router.post('/:collection/:id', [
    checkJWT,
    checkSuper,
    checkImage] , updateImage);


router.get('/:collection/:id', [
    check('id','Id is required').isMongoId(),
    check('collection').custom( c => allowedCollections( c, ['product','category'] ) ),
    checkParams
]);
  

module.exports = router;