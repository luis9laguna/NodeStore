//REQUIRED
const { sortProducts } = require('../helpers/sort-products');
const Product = require('../models/product');
const slugify = require('slugify');
//CODE

//GET ALL
const getAllProducts = async (req, res) => {

    try {
        //DB QUERY
        const query = Product.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $match: { "category.status": true, "status": true } },
            { $project: { "cost": 0 } }
        ])

        //REQUESTS
        const sort = req.query.sort
        const page = parseInt(req.query.page) || 1
        const pageSize = parseInt(req.query.limit) || 15

        //SORTING SORT
        const newSort = sortProducts(sort)

        //GETTING PAGINATION AND DATA
        const skip = (page - 1) * pageSize;
        let total = await query;
        total = total.length
        const pages = Math.ceil(total / pageSize)

        //IF NO DATA
        if (page > pages) return res.status(404).json({ status: 'false', message: "Page/Data not found" })

        //GETTING DATA FROM THE DB
        let data = await query.sort(newSort).skip(skip).limit(pageSize)

        res.json({
            ok: true,
            products: data,
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

//GET NEWEST
const getNewestProduct = async (req, res) => {

    try {
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $match: { "category.status": true, "status": true } },
            { $project: { "cost": 0 } },
            { $sort: { createdAt: -1 } },
            { $limit: 10 }
        ])

        res.json({
            ok: true,
            products
        });

    } catch (error) {
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
        let product = await Product.findOne({ 'slug': slug, 'status': true }).select(['-cost'])
            .populate('category', 'name status slug');

        if (!product || !product.category.status) {
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
        product.name = name.toLowerCase()

        //SAVE CATEGORY
        await product.save();

        res.json({
            ok: true,
            product
        })

    } catch (error) {
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
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}


//CHECK STOCK
const checkStock = async (req, res) => {

    try {
        const slug = req.params.slug;
        const productDB = await Product.findOne({ 'slug': slug, 'status': true })

        if (!productDB) {
            return res.status(404).json({
                ok: false,
                message: 'Product not found'
            });
        }

        res.json({
            ok: true,
            stock: productDB.stock
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}

//UPDATE STOCK

const updateStock = async (req, res) => {

    try {
        const id = req.params.id;
        const stock = req.body.stock
        const productDB = await Product.findById(id)

        if (!productDB) {
            return res.status(404).json({
                ok: false,
                message: 'Product not found'
            });
        }

        //UPDATE PRODUCT
        const newStock = productDB.stock + parseInt(stock)
        const productUpdate = await Product.findByIdAndUpdate(id, { stock: newStock }, { new: true });

        res.json({
            ok: true,
            productUpdate
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}

module.exports = {
    getAllProducts,
    getNewestProduct,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    checkStock,
    updateStock
}