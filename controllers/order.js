//REQUIRED
const Order = require('../models/order');
const OrderItem = require('../models/order-item');
const Product = require('../models/product');
const User = require('../models/user')
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require('../helpers/send-email');
const { sellInformation } = require('../helpers/sellInformation');

//CODE

//GET ORDER BY CODE
const getOrderByCode = async (req, res) => {

    try {
        const code = req.params.code;
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
                    image: item.product.images[0]
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
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}

//GET ORDERS BY USER
const getOrdersByUser = async (req, res) => {

    try {
        const user = req.id;
        const query = Order.find({ user }, 'code total status createdAt').sort({ 'updatedAt': -1 })

        //REQUESTS
        const page = parseInt(req.query.page) || 1
        const pageSize = parseInt(req.query.limit) || 10

        //GETTING PAGINATION AND DATA
        const skip = (page - 1) * pageSize;
        let total = await query
        total = total.length
        const pages = Math.ceil(total / pageSize)

        //IF NO DATA
        if (page > pages) return res.status(404).json({ status: 'false', message: "Page/Data not found" })

        //GETTING DATA FROM THE DB
        let data = await query.skip(skip).limit(pageSize).clone()

        res.json({
            ok: true,
            orders: data,
            count: data.length,
            page,
            pages
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}

//GET ALL ORDERS
const getAllOrders = async (req, res) => {

    try {
        //SORT STATUS
        const reqStatus = req.query.sort
        const sortStatus = reqStatus === 'all' ? { $gte: 0 } : reqStatus

        //DB QUERY
        const query = Order.find({ status: sortStatus })

        //REQUESTS
        const page = parseInt(req.query.page) || 1
        const pageSize = parseInt(req.query.limit) || 10

        //GETTING PAGINATION AND DATA
        const skip = (page - 1) * pageSize;
        let total = await query

        total = total.length
        const pages = Math.ceil(total / pageSize)

        //IF NO DATA
        if (page > pages) return res.status(200).json({ status: 'ok', message: "Page/Data not found" })

        //GETTING DATA FROM THE DB
        let data = await query.sort({ 'updatedAt': -1 }).skip(skip).limit(pageSize).clone()

        res.json({
            ok: true,
            orders: data,
            count: data.length,
            page,
            pages
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}


//GET ORDERS COMPLETED INFORMATION
const completedInformation = async (req, res) => {

    try {
        //GETTING DATA FROM DB
        const completedOrders = await Order.find({ status: "delivered" }).
            populate('address');
        const {
            totalCompleted,
            totalSold,
            totalCost,
            totalRevenue
        } = sellInformation(completedOrders)

        //GET DATA FROM LAST MONTH
        let monthData = new Date();
        monthData.setMonth(monthData.getMonth() - 1);
        const completedLastMonth = await Order.find({ status: "delivered", createdAt: { $gte: monthData } })
        const {
            totalCompleted: totalLastMonth,
            totalRevenue: RevenueLastMonth
        } = sellInformation(completedLastMonth)



        // //ADDRESS OF USERS WHO BOUGHT
        // const addressessUser = completedOrders.map((array) => {
        //     return array.address.address;
        // });

        // const province = addressessUser.filter(function (p) {
        //     return p.state == "metropolitana"
        // });

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
        // const statesUser = completedOrders.map((array) => {
        //     return array.address.address.state;
        // });

        //RESPONSE
        res.json({
            ok: true,
            orders: {

                totalCompleted,
                totalCost,
                totalSold,
                totalRevenue,
                totalLastMonth,
                RevenueLastMonth
                // statesUser,
                // province,
            }
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}


//CREATE
const createOrder = async (req, res) => {

    try {

        //INFO USER AND ADDRESS
        const token = req.cookies.token;
        let userId;

        const { address, orderItems } = req.body
        if (token) {
            userId = jwt.verify(token, process.env.JWT_SECRET).id;
            const user = await User.findById(userId)
            if (!user) {
                return res.status(404).json({
                    ok: false,
                    message: "User not found"
                });
            }
        }

        if (!address) return res.status(404).json({ ok: false, message: "Address is needed" })

        //CODE ITEMS ORDER
        const orderItemsInfo = await Promise.all(orderItems.map(async (orderItem) => {

            //DECREASE THE STOCK 
            let productDB = await Product.findById(orderItem.product);
            productDB.stock = productDB.stock - orderItem.quantity;
            if (productDB.stock < 0) {
                return res.status(500).json({
                    ok: false,
                    message: 'There arent enough products'
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

        //GETTING TOTALS
        let totalPrice = []
        let totalCost = []

        orderItemsInfo.map(orderItemInfo => {
            totalPrice.push(orderItemInfo.totalPricesInfo)
            totalCost.push(orderItemInfo.totalCostsInfo)
        });

        totalPrice = totalPrice.reduce((a, b) => a + b, 0);
        totalCost = totalCost.reduce((a, b) => a + b, 0);

        //GETTING IDS IN ORDERITEMS
        const idItemsArray = orderItemsInfo.map(orderItemInfo => {
            return orderItemInfo.idItem
        });

        //ORDER
        let order = new Order();
        order.code = uuidv4();
        order.user = userId || null;
        order.address = address
        order.totalCost = totalCost;
        order.total = totalPrice;
        order.orderItems = idItemsArray;
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
            orderUpdate,
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