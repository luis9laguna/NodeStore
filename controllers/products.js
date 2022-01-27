//REQUIRED
const Product = require('../models/product');

//CODE

//GET ALL
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

//GET NEWEST
const getNewestProduct = async (req, res) => {
    try {

        const products = await Product.find({ "status": true }).sort({ createdAt: 'asc' }).limit(10);

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

//GET PRODUCT BY SLUG
const getProductBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        const product = await Product.findOne({ 'slug': slug });

        if (!product) {
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

        //PRODUCT
        let product = new Product(req.body);

        //SLUG
        const slug = slugify(name)
        product.slug = slug

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


        const id = req.params.id;
        const productDB = await Product.findById(id);

        //VERIFY PRODUCT
        if (!productDB) {
            return res.status(404).json({
                ok: false,
                message: 'Product not found'
            });
        }

        //NEWDATA
        const slug = slugify(productDB.name)
        let newProduct = req.body
        newProduct.slug = slug

        //UPDATE PRODUCT
        const productUpdate = await Product.findByIdAndUpdate(id, newProduct, { new: true });

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
        const id = req.params.id;
        const ProductDB = await Product.findById(id);

        if (!ProductDB) {
            return res.status(404).json({
                ok: false,
                message: 'Product not found'
            });
        }

        //DELETE CATEGORY
        await Product.findByIdAndUpdate(id, { status: false }, { new: true });

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
    getNewestProduct,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct
}