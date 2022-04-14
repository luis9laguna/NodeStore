//REQUIRED
const { sortProducts } = require('../helpers/sort-products');
const Product = require('../models/product');
const OrderItems = require('../models/order-item');
const slugify = require('slugify');
const cloudinary = require('cloudinary').v2
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
        const { name, images } = req.body;
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
        const nameLower = name.toLowerCase()
        const cleanName = nameLower.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

        //MOVING IMAGE CLOUDINARY
        let newImages = new Array
        for (const image of images) {
            const oldNameArray = image.split('/');
            const oldnameId = oldNameArray[oldNameArray.length - 1];
            const [public_id] = oldnameId.split('.');
            const newPublic_id = `products/${cleanName}/${public_id}`
            const { secure_url } = await cloudinary.uploader.rename(public_id, newPublic_id)
            newImages.push(secure_url)
        }
        if (newImages.length === 0) newImages.push('https://res.cloudinary.com/bestecommerce/image/upload/v1668298542/default/default/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp_llrbwu.jpg')

        //SLUG
        product.slug = slugify(cleanName)
        product.name = nameLower
        product.images = newImages

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
        const { name, images } = req.body;
        const productDB = await Product.findById(id);
        const imgDefault = 'https://res.cloudinary.com/bestecommerce/image/upload/v1668298542/default/default/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp_llrbwu.jpg'


        //VERIFY PRODUCT
        if (!productDB) {
            return res.status(404).json({
                ok: false,
                message: 'Product not found'
            });
        }

        //NEWDATA
        const nameLower = name.toLowerCase()
        const cleanName = nameLower.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

        //MOVING IMAGE CLOUDINARY
        let newImages = new Array
        for (const image of images) {
            if (imgDefault !== image) {
                const oldNameArray = image.split('/');

                //IF THE OLD PHOTO WAS ORGANIZED BEFORE
                let finishedOldRoute
                if (oldNameArray.length === 10) {
                    //GET THE OLD ROUTE ARRAY
                    const oldRouteArray = oldNameArray.slice(-3)
                    const wholeOldRoute = oldRouteArray.join('/')
                    const [oldRoute] = wholeOldRoute.split('.')
                    finishedOldRoute = oldRoute.replace(/%20/g, " ")
                } else {
                    const wholeOldRoute = oldNameArray[oldNameArray.length - 1];
                    [finishedOldRoute] = wholeOldRoute.split('.')
                }
                //GETTING THE LAST PART OF PUBLIC ID
                const oldnameId = oldNameArray[oldNameArray.length - 1]
                const [public_id] = oldnameId.split('.');
                const newPublic_id = `products/${cleanName}/${public_id}`

                //MOVING FOLDER
                if (finishedOldRoute !== newPublic_id) {
                    const { secure_url } = await cloudinary.uploader.rename(finishedOldRoute, newPublic_id)
                    newImages.push(secure_url)
                } else {
                    newImages.push(image)
                }
            }
        }
        if (newImages.length === 0) newImages.push(imgDefault)

        let newProduct = req.body
        newProduct.slug = slugify(cleanName)
        newProduct.name = nameLower
        newProduct.images = newImages

        //UPDATE PRODUCT
        const productUpdate = await Product.findByIdAndUpdate(id, newProduct, { new: true });

        res.json({
            ok: true,
            product: productUpdate
        });

    } catch (error) {
        console.log(error)
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

        const productInOrder = await OrderItems.find({ "product": id });

        if (productInOrder) {
            await Product.findByIdAndRemove(id);
        } else {
            await Product.findByIdAndUpdate(id, { status: false }, { new: true });
        }


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
        const id = req.params.id;

        const productDB = await Product.findById(id)
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