//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');

//FUNCTIONS
const { getOrder,
    getAllOrders,
    createOrder,
    updateOrder,
    deleteOrder } = require('../controllers/order');
const { checkParams } = require('../middlewares/check-params');
const { checkJWT, checkAdmin } = require('../middlewares/check-jwt');

//CODE
const router = Router();

//GET
router.get('/:id', checkAdmin, getOrder);

//GET ALL

router.get('/', getAllOrders);

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
[ checkAdmin,
    check('status', 'Status is required').not().isEmpty(),
    checkParams
], updateOrder);

router.delete('/:id', deleteOrder)


module.exports = router;