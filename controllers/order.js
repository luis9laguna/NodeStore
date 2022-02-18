//REQUIRED
const Order = require('../models/order');
const OrderItem = require('../models/order-item');
const Product = require('../models/product');
const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require('../helpers/send-email');


//CODE

//GET ORDER BY CODE
const getOrderByCode = async (req, res) => {
    try {

        const code = req.body.code;
        const orderDB = await Order.findOne({ code }).populate({
            path: 'orderItems',
            populate: { path: 'product' }
        }).populate('address');

        if (!orderDB) {
            return res.status(404).json({
                ok: false,
                message: 'Order not found'
            });
        }

        //NEW ORDER ITEMS
        let newOrderItems = []
        orderDB.orderItems.map(item => {
            newOrderItems.push({
                product: {
                    name: item.product.name,
                    price: item.product.price,
                    image: item.product.image
                },
                quantity: item.quantity
            })
        })

        res.json({
            ok: true,
            order: {
                address: orderDB.address.address,
                status: orderDB.status,
                total: orderDB.total,
                shipping: orderDB.shipping,
                updated: orderDB.updatedAt,
                orderItems: newOrderItems
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}

//GET ORDERS BY USER
const getOrdersByUser = async (req, res) => {
    try {

        //GETTING INFO FOR PAGINATION
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;

        //GETTING INFORMATION FROM THE DB
        const user = req.id;
        const orders = await Order.find({ user }, 'code total status createdAt').sort({ 'updatedAt': -1 })
            .skip(skip).limit(pageSize);

        //MORE INFO FOR PAGINATION
        const total = await Order.find({ user }, 'code total status createdAt').sort({ 'updatedAt': -1 }).countDocuments();
        const pages = Math.ceil(total / pageSize)

        //IN CASE FOR MORE PAGE THAT WE HAVE
        if (page > pages) {
            return res.status(404).json({
                status: 'false',
                message: "No page found"
            })
        }

        res.json({
            ok: true,
            orders,
            count: orders.length,
            page,
            pages
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

        //GETTING INFO FOR PAGINATION
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;

        //SORT
        const reqSort = req.query.sort
        const sort = reqSort === 'all' ? { $gte: 0 } : reqSort

        //GETTING ORDERS FROM DB
        const orders = await Order.find({ status: sort }).sort({ 'updatedAt': -1 })
            .skip(skip).limit(pageSize);

        //MORE INFO FOR PAGINATION
        const total = await Order.find({ status: sort }).sort({ 'updatedAt': -1 }).countDocuments();
        const pages = Math.ceil(total / pageSize)

        //IN CASE FOR MORE PAGE THAT WE HAVE
        if (page > pages) {
            return res.status(404).json({
                status: 'false',
                message: "No page found"
            })
        }

        res.json({
            ok: true,
            orders,
            count: orders.length,
            page,
            pages
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}


//GET ORDERS COMPLETED INFORMATION
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


//CREATE
const createOrder = async (req, res) => {
    try {

        //ID USER
        const idUser = req.id

        //CODE ITEMS ORDER
        const orderItemsInfo = await Promise.all(req.body.orderItems.map(async (orderItem) => {

            //DECREASE THE STOCK 
            let productDB = await Product.findById(orderItem.product);
            productDB.stock = productDB.stock - orderItem.quantity;
            if (productDB.stock < 0) {
                res.status(500).json({
                    ok: false,
                    message: 'There arent that amount of products'
                });
            }

            //CREATING NEW ORDER ITEM
            const newOrderItem = new OrderItem({
                product: orderItem.product,
                quantity: orderItem.quantity,
            });

            //UPDATE STOCK AND SAVE ORDER ITEM
            await productDB.save();
            await newOrderItem.save();

            return {
                idItem: newOrderItem._id,
                totalPricesInfo: productDB.price * orderItem.quantity,
                totalCostsInfo: productDB.cost * orderItem.quantity
            }
        }));

        //GETTING TOTAL PRICE
        const totalPricesArray = orderItemsInfo.map(orderItemInfo => {
            return orderItemInfo.totalPricesInfo
        });
        const totalPrice = totalPricesArray.reduce((a, b) => a + b, 0);

        //GETTING TOTAL COST
        const totalCostsArray = orderItemsInfo.map(orderItemInfo => {
            return orderItemInfo.totalCostsInfo
        });
        const totalCost = totalCostsArray.reduce((a, b) => a + b, 0);

        //GETTING IDS IN ORDERITEMS
        const idItemsArray = orderItemsInfo.map(orderItemInfo => {
            return orderItemInfo.idItem
        });

        //ORDER
        let order = new Order(req.body);
        order.code = uuidv4();
        order.user = idUser;
        order.orderItems = idItemsArray;
        order.total = totalPrice;
        order.totalCost = totalCost;
        orderAndShipping = totalPrice + 15;

        //SAVE ORDER
        await order.save();

        //SHOWING NULL IN THE RESPONSE COST
        order.totalCost = null;


        //SEND EMAIL
        // await sendEmail(email, subject, text, code);

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
            message: 'Order has been updated'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        });
    }
}


module.exports = {
    getOrderByCode,
    getAllOrders,
    completedInformation,
    getOrdersByUser,
    createOrder,
    updateOrder
}