//REQUIRED
const Order = require('../models/order');
const OrderItem = require('../models/order-item');
const Product = require('../models/product');
const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require('../helpers/send-email');


//CODE

//GET
const getOrder = async (req, res) => {
    try {

        const id = req.params.id;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                ok: false,
                message: 'Order not found'
            });
        }

        res.json({
            ok: true,
            order
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}

//GET ORDER BY CODE IN CASE OF NOT LOGGED USER
const getOrderByCode = async (req, res) => {
    try {

        const code = req.body.code;
        const order = await Order.findOne({ code });

        if (!order) {
            return res.status(404).json({
                ok: false,
                message: 'Order not found'
            });
        }

        const status = order.status

        res.json({
            ok: true,
            status
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}

//GET ALL ORDERS
const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find().sort({ 'createdAt': -1 });

        res.json({
            ok: true,
            orders
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}


//GET COMPLETED INFORMATION
const completedInformation = async (req, res) => {
    try {

        const completedOrders = await Order.find({ "status": "delivered" }).
            populate('address');

        //TOTAL OF COMPLETED ORDERS
        const totalCompleted = completedOrders.length;

        //TOTAL OF SOLD AND COST
        const arrayTotal = completedOrders.map((array) => {
            const totalPrice = array.total;
            return totalPrice;
        });

        const arrayCost = completedOrders.map((array) => {
            const orderCost = array.totalCost;
            return orderCost;
        });

        const totalSold = arrayTotal.reduce((a, b) => a + b, 0);
        const totalCost = arrayCost.reduce((a, b) => a + b, 0);

        //TOTAL REVENUE
        const totalRevenue = totalSold - totalCost

        //ADDRESS OF USERS WHO BOUGHT
        const addressessUser = completedOrders.map((array) => {
            return array.address.address;
        });
        
        const province = addressessUser.filter(function (p) {
            return p.state == "metropolitana"
        });

        //IF I ONLY NEED PROVINCE AND CITY 
        //     const reducedFilter = (data, keys, fn) =>
        //     data.filter(fn).map(el =>
        //         keys.reduce((acc, key) => {
        //             acc[key] = el[key];
        //             return acc;
        //         }, {})
        //     );

        // const provinceCityMetro = reducedFilter(addressessUser, ['province', 'city'], item => item.state == "metropolitana");

        //STATES OF USERS WHO BOUGHT
        const statesUser = completedOrders.map((array) => {
            return array.address.address.state;
        });

        //RESPONSE
        res.json({
            ok: true,
            totalCompleted,
            totalSold,
            totalRevenue,
            statesUser,
            province
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}

//GET ORDERS BY USER
const getOrdersByUser = async (req, res) => {
    try {

        const user = req.params.id;
        const orders = await Order.find({ user }).sort({ 'createdAt': -1 });

        res.json({
            ok: true,
            orders
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}

//CREATE
const createOrder = async (req, res) => {
    try {

        //CODE ITEMS ORDER
        const orderItemsIds = await Promise.all(req.body.orderItems.map(async (orderItem) => {
            let newOrderItem = new OrderItem({
                product: orderItem.product,
                quantity: orderItem.quantity,
            });

            //SAVE ORDER ITEM
            newOrderItem = await newOrderItem.save();

            //DECREASE THE STOCK 
            const productDB = await Product.findById(orderItem.product);
            productDB.stock = productDB.stock - orderItem.quantity;
            if (productDB.stock < 0) {
                res.status(500).json({
                    ok: false,
                    message: 'There arent that amount of products'
                });
            } else {
                await productDB.save();
                return newOrderItem._id;
            }
        }));

        // CODE TOTAL PRICE
        const orderItemsIdsResolved = orderItemsIds;

        const totalPricesArray = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
            const totalPrice = orderItem.product.price * orderItem.quantity;
            return totalPrice
        }));

        const totalCostArray = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'cost');
            const ArrayCost = orderItem.product.cost * orderItem.quantity;
            return ArrayCost
        }));

        const totalCost = totalCostArray.reduce((a, b) => a + b, 0);
        const totalPrice = totalPricesArray.reduce((a, b) => a + b, 0);

        //ORDER
        let order = new Order(req.body);
        order.code = uuidv4();
        order.orderItems = orderItemsIdsResolved;
        order.total = totalPrice;
        order.totalCost = totalCost;
        orderAndShipping = totalPrice + 3500;

        //SAVE ORDER
        await order.save();

        //SEND EMAIL
        // await sendEmail(email, subject, text, code);

        order.totalCost = 0;
        res.json({
            ok: true,
            order,
            orderAndShipping
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        });
    }
}


//UPDATE
const updateOrder = async (req, res) => {
    try {


        const id = req.params.id;
        const orderDB = await Order.findById(id);

        //VERIFY ORDER
        if (!orderDB) {
            return res.status(404).json({
                ok: false,
                message: 'Order not found'
            });
        }

        //UPDATE ORDER
        const { status } = req.body;
        const orderUpdate = await Order.findByIdAndUpdate(id, { status }, { new: true });

        res.json({
            ok: true,
            order: orderUpdate
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        });
    }
}


module.exports = {
    getOrder,
    getAllOrders,
    getOrderByCode,
    completedInformation,
    getOrdersByUser,
    createOrder,
    updateOrder
}