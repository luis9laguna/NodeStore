//REQUIRED
const Product = require('../models/product');

//CODE

//GET
const getProduct = async (req, res) => {
    try {

        const products = await Product.find({ "status": true }).sort('name');

        res.json({
            ok: true,
            products
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}

//GET PRODUCT BY ID
const getProductByID = async (req, res) => {
    try {
        const uid = req.params.id;
        const product = await Product.findById(uid);

        if(!product){
            return res.status(404).json({
                ok: false,
                message: 'Product not found'
            });
        }

        res.json({
            ok: true,
            product
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
        const productDB = await Product.findById(uid);

        //VERIFY PRODUCT
        if (!productDB) {
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
    getProductByID,
    createProduct,
    updateProduct,
    deleteProduct
}