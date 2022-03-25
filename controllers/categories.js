//REQUIRED
const Category = require('../models/category');
const Product = require('../models/product');
const slugify = require('slugify')
const { sortProducts } = require('../helpers/sort-products');
const cloudinary = require('cloudinary').v2

//CODE
cloudinary.config(process.env.CLOUDINARY_URL);

//GET ALL CATEGORIES
const getCategories = async (req, res) => {

    try {
        const categories = await Category.find({ "status": true }).sort('name');

        res.json({
            ok: true,
            categories
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}

//GET ALL PRODUCTS BY CATEGORY
const getProductsByCategory = async (req, res) => {

    try {
        //GETTING CATEGORY FROM THE DB
        const slug = req.params.slug;
        const category = await Category.findOne({ slug: slug, status: true })

        if (!category) {
            return res.status(404).json({
                ok: false,
                message: 'Category not found'
            });
        }

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
            { $match: { "category.status": true, "status": true, "category._id": category._id } },
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
            category,
            products: data,
            count: data.length,
            page,
            pages
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        });
    }
}


//CREATE
const createCategory = async (req, res) => {
    try {

        const { name, images } = req.body;
        const existCategory = await Category.findOne({ name, 'status': true });

        //VERIFY CATEGORY
        if (existCategory) {
            return res.status(400).json({
                ok: false,
                message: "This Category already exists."
            });
        }

        //CATEGORY
        let category = new Category(req.body);

        //MOVING IMAGE CLOUDINARY
        const oldNameArray = images[0].split('/');
        const oldnameId = oldNameArray[oldNameArray.length - 1];
        const [public_id] = oldnameId.split('.');
        const newPublic_id = `categories/${name}/${public_id}`

        const { secure_url } = await cloudinary.uploader.rename(public_id, newPublic_id)

        //SLUG
        const slug = slugify(name)
        category.name = name.toLowerCase()
        category.slug = slug
        category.image = secure_url

        // SAVE CATEGORY
        await category.save();

        res.json({
            ok: true,
            category
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        });
    }
}


//UPDATE
const updateCategory = async (req, res) => {

    try {
        const id = req.params.id;
        const { name, images } = req.body;
        const category = await Category.findById(id);

        //VERIFY CATEGORY
        if (!category) {
            return res.status(404).json({
                ok: false,
                message: 'Category not found'
            });
        }

        //MOVING IMAGE CLOUDINARY
        const oldNameArray = images[0].split('/');

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
        const newPublic_id = `categories/${name}/${public_id}`

        //JUST IN CASE THE NEXT VALIDATION DOESNT PASS
        let finalImage = images[0]

        //MOVING FOLDER
        if (finishedOldRoute !== newPublic_id) {
            const resp = await cloudinary.uploader.rename(finishedOldRoute, newPublic_id)
            finalImage = resp.secure_url
        }

        //NEWDATA
        const slug = slugify(name)
        let newCategory = req.body
        newCategory.slug = slug
        newCategory.image = finalImage

        //UPDATE CATEGORY
        const categoryUpdate = await Category.findByIdAndUpdate(id, newCategory, { new: true });

        res.json({
            ok: true,
            category: categoryUpdate
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        });
    }
}

//DELETE
const deleteCategory = async (req, res) => {

    try {
        const id = req.params.id;
        const CategoryDB = await Category.findById(id);

        if (!CategoryDB) {
            return res.status(404).json({
                ok: false,
                message: 'Category not found'
            });
        }

        //DELETE CATEGORY
        const products = await Product.find({ "category": id });

        if (products.length < 1) {
            await Category.findByIdAndDelete(id)
        } else {
            await Category.findByIdAndUpdate(id, { status: false }, { new: true });
        }

        res.json({
            ok: true,
            message: "Category deleted"
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}

module.exports = {
    getCategories,
    getProductsByCategory,
    createCategory,
    updateCategory,
    deleteCategory
}