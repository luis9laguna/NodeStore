//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');

//FUNCTIONS
const { getOrder,
    getAllOrders,
    completeOrders,
    createOrder,
    updateOrder,
    deleteOrder } = require('../controllers/order');
const { checkParams } = require('../middlewares/check-params');
const { checkJWT, checkAdmin } = require('../middlewares/check-jwt');

//CODE
const router = Router();

//GET
router.get('/:id', checkJWT, getOrder);

//GET COMPLETE ORDERS
router.get('/total/a',[ 
    checkJWT,
    checkAdmin
], completeOrders);

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
    check('total', 'Total is required').not().isEmpty(),
    check('products.[0].product', 'Product is required').isMongoId(),
    check('products.[0].quantity', 'Quantity is required').not().isEmpty(),
    checkParams
], createOrder);

//PUT
router.put('/:id',
[ 
    checkJWT,
    checkAdmin,
    check('status', 'Status is required').not().isEmpty(),
    checkParams
], updateOrder);

router.delete('/:id', deleteOrder);


module.exports = router;