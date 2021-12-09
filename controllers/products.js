//REQUIRED
const Product = require('../models/product');
const User = require('../models/user');

//CODE

//GET
const getProduct = async (req, res) => {
    try {

        const categories = await Product.find({ "status": true }).sort('name');

        res.json({
            ok: true,
            categories
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
const createProduct = async (req, res) => {
    try {

        const { name } = req.body;
        const existProduct = await Product.findOne({ name });

        //VERIFY PRODUCT
        if (existProduct) {
            return res.status(400).json({
                ok: false,
                message: "This Product already exists."
            });
        }

        const product = new Product(req.body);

        //SAVE CATEGORY
        await product.save();

        res.json({
            ok: true,
            product
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        });
    }
}


//UPDATE
const updateProduct = async (req, res) => {
    try {


        const uid = req.params.id;
        const userDB = await Product.findById(uid);

        //VERIFY PRODUCT
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                message: 'Product not found'
            });
        }

        //UPDATE PRODUCT
        const { __v, ...field } = req.body;
        const productUpdate = await Product.findByIdAndUpdate(uid, field, { new: true });

        res.json({
            ok: true,
            product: productUpdate
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        });
    }
}


//DELETE
const deleteProduct = async (req, res) => {
    try {
        const uid = req.params.id;
        const ProductDB = await Product.findById(uid);

        if (!ProductDB) {
            return res.status(404).json({
                ok: false,
                message: 'Product not found'
            });
        }

        //DELETE CATEGORY
        await Product.findByIdAndUpdate(uid, { status: false }, { new: true });

        res.json({
            ok: true,
            message: "Product deleted"
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
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}