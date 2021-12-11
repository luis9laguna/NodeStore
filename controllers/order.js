//REQUIRED
const Order = require('../models/order');
const OrderItem = require('../models/order-item');
const Product = require('../models/product');

//CODE

//GET
const getOrder = async (req, res) => {
    try {

        const uid = req.params.id;
        const order = await Order.findById(uid);

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

        const completedOrders = await Order.find({ "status": "delivered" })
        const totalCompleted = completedOrders.length;

        const arrayTotal = await Promise.all(completedOrders.map(async (array) => {
            const totalPrice = array.total;
            return totalPrice;
        }));

        const arrayCost = await Promise.all(completedOrders.map(async (array) => {
            const orderCost = array.totalCost;
            return orderCost;
        }));

        const totalSold = arrayTotal.reduce((a, b) => a + b, 0);
        const totalCost = arrayCost.reduce((a, b) => a + b, 0);
        const totalRevenue = totalSold - totalCost

        res.json({
            ok: true,
            totalCompleted,
            totalSold,
            totalRevenue
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

        const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
            let newOrderItem = new OrderItem({
                product: orderItem.product,
                quantity: orderItem.quantity,
            });

            newOrderItem = await newOrderItem.save();

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
        const orderItemsIdsResolved = await orderItemsIds;

        const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
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
        const totalPrice = totalPrices.reduce((a, b) => a + b, 0);


        let order = new Order(req.body);
        order.orderItems = orderItemsIdsResolved;
        order.total = totalPrice;
        order.totalCost = totalCost;
        orderAndShipping = totalPrice + 3500;

        //SAVE CATEGORY
        await order.save();

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


        const uid = req.params.id;
        const orderDB = await Order.findById(uid);

        //VERIFY ORDER
        if (!orderDB) {
            return res.status(404).json({
                ok: false,
                message: 'Order not found'
            });
        }

        //UPDATE ORDER
        const { status } = req.body;
        const orderUpdate = await Order.findByIdAndUpdate(uid, { status }, { new: true });

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
    completedInformation,
    getOrdersByUser,
    createOrder,
    updateOrder
}