//REQUIRED
const Order = require('../models/order');

//CODE

//GET
const getOrder = async (req, res) => {
    try {

        const uid = req.params.id;
        const order = await Order.findById(uid);

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

const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find();

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

        const order = new Order(req.body);

        //SAVE CATEGORY
        await order.save();

        res.json({
            ok: true,
            order
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
        const orderUpdate = await Order.findByIdAndUpdate(uid, {status}, { new: true });

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

const deleteOrder = async (req, res) => {
    try {
        const uid = req.params.id;
        let asd = await Order.findById(uid);
        

        //DELETE CATEGORY
        // await Order.product.findByIdAndUpdate(uid, {status:false}, {new: true });
        let popo = asd;
        console.log(popo);
        res.json({
           popo
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}


module.exports = {
    getOrder,
    getAllOrders,
    createOrder,
    updateOrder,
    deleteOrder
}