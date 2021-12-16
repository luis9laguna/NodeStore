//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');

//FUNCTIONS
const { getOrder,
    getOrdersByUser,
    getOrderByCode,
    getAllOrders,
    completedInformation,
    createOrder,
    updateOrder } = require('../controllers/order');
const { checkParams } = require('../middlewares/check-params');
const { checkJWT, checkAdmin } = require('../middlewares/check-jwt');

//CODE
const router = Router();

//GET
router.get('/:id', checkJWT, getOrder);

//GET ORDERS BY USER
router.get('/all/:id', checkJWT, getOrdersByUser);

//GET COMPLETE ORDERS
router.get('/total/information',[ 
    checkJWT,
    checkAdmin
], completedInformation);

////GET ORDERS BY CODE
router.get('/code/status', getOrderByCode);

//GET ALL
router.get('/', [ 
    checkJWT,
    checkAdmin
], getAllOrders);

//POST
router.post('/',
[ checkJWT,
    check('user', 'User is required').isMongoId(),
    check('address', 'Address is required').isMongoId(),
    checkParams
], createOrder);

//PUT
router.put('/:id',
[ 
    checkJWT,
    checkAdmin,
    check('status', 'Status is required').not().isEmpty().trim().escape(),
    checkParams
], updateOrder);


module.exports = router;