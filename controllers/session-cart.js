//REQUIRED
const Cart = require('../models/session-cart');

//CODE

//GET
const getCart = async (req, res) => {

    try {

        const id = req.params.id;
        const cart = await Cart.find({ "user": id });

        res.json({
            ok: true,
            cart
        });

    } catch (err) {

        console.log(err);
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}

//GET ALL CARTS
const getAllCarts = async (req, res) => {
    try {
        const allCarts = await Cart.countDocuments();

        res.json({
            ok: true,
            total: allCarts
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}

//CREATE
const createCart = async (req, res) => {

    try {

        const user = req.body.user
        const cartDB = Cart.findOne({ "user": user })

        //CREATE ADDRESS
        const cart = new Cart(req.body);

        if (cartDB) {
            return res.status(400).json({
                ok: false,
                message: 'This user has already a cart'
            });
        } else {
            //SAVE ADDRESS
            await cart.save();
        }

        res.json({
            ok: true,
            cart
        });

    } catch (err) {

        console.log(err);
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });

    }
}


//UPDATE    
const updateCart = async (req, res) => {

    try {

        const id = req.params.id;
        const cartDB = await Cart.findOne({ "user": id });

        //VERIFY CART
        if (!cartDB) {
            return res.status(404).json({
                ok: false,
                message: "Cart not found"
            });
        }

        //UPDATE CART
        const { __v, user, ...field } = req.body;
        const cartUpdate = await Cart.findOneAndUpdate({ "user": id }, field, { new: true });

        res.json({
            ok: true,
            cart: cartUpdate
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}


//DELETE
const deleteCart = async (req, res) => {

    try {

        const id = req.params.id;
        const cartDB = await Cart.findOneAndRemove({ "user": id })
        //VERIFY ADDRESS
        if (!cartDB) {
            return res.status(404).json({
                ok: false,
                message: "Cart not found"
            });
        }

        await Cart.findByIdAndRemove(id, cartDB);

        res.json({
            ok: true,
            message: "Cart deleted"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}



module.exports = {
    getCart,
    getAllCarts,
    createCart,
    updateCart,
    deleteCart
}