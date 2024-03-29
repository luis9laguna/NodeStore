//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');
const rateLimit = require("express-rate-limit");

//FUNCTIONS
const {
    getOrderByCode,
    getOrdersByUser,
    getAllOrders,
    completedInformation,
    createOrder,
    updateOrder } = require('../controllers/order');
const { checkParams } = require('../middlewares/check-params');
const { checkJWT, checkAdmin } = require('../middlewares/check-jwt');

//CODE
const router = Router();
const orderLimitter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: {
        code: 429,
        message: "Too many requests, wait for a moment"
    }
});

//GET ORDERS BY CODE
router.get('/code/:code', getOrderByCode);

//GET ORDERS BY USER
router.get('/user/all', checkJWT, getOrdersByUser);

//GET COMPLETED ORDERS
router.get('/total/information', [
    checkJWT,
    checkAdmin
], completedInformation);


//GET ALL
router.get('/', [
    checkJWT,
    checkAdmin
], getAllOrders);

//POST
router.post('/', orderLimitter, createOrder);

//PUT
router.put('/:id',
    [
        checkJWT,
        checkAdmin,
        check('status', 'Status is required').not().isEmpty().trim().escape(),
        checkParams
    ], updateOrder);


module.exports = router;