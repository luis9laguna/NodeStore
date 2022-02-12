//REQUIRED
const { sortProducts } = require('../helpers/sort-products');
const Product = require('../models/product');
const slugify = require('slugify')
//CODE

//GET ALL
const getProduct = async (req, res) => {
    try {

        //GETTING INFO FOR PAGINATION
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;

        //SORTING SORT
        const sort = req.query.sort
        const { newSort } = sortProducts(sort)

        //GETTING PRODUCTS FROM THE DB
        const products = await Product.find({ "status": true }).sort(newSort)
            .skip(skip).limit(pageSize);


        //MORE INFO FOR PAGINATION
        const total = await Product.countDocuments();
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
            products,
            count: products.length,
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

        const products = await Product.find({ "status": true }).sort({ createdAt: 'asc' }).limit(10);

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
        const productDB = await Product.findOne({ 'slug': slug, 'status': true }).populate('category');

        if (!productDB) {
            return res.status(404).json({
                ok: false,
                message: 'Product not found'
            });
        }

        res.json({
            ok: true,
            product: {
                name: productDB.name,
                description: productDB.description,
                price: productDB.price,
                image: productDB.image,
                likes: productDB.likes,
                stock: productDB.stock,
                category: productDB.category.slug
            }
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

module.exports = {
    getProduct,
    getNewestProduct,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct
}