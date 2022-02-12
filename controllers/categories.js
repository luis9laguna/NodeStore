//REQUIRED
const Category = require('../models/category');
const Product = require('../models/product');
const slugify = require('slugify')
const { v4: uuidv4 } = require('uuid');
const { sortProducts } = require('../helpers/sort-products');
const cloudinary = require('cloudinary').v2

//CODE

//GET ALL CATEGORIES
const getCategories = async (req, res) => {
    try {

        const categories = await Category.find({ "status": true }).sort('name');

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

//GET ALL PRODUCTS BY CATEGORY
const getProductByCategory = async (req, res) => {

    try {

        //GETTING INFO FOR PAGINATION
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;

        //SORTING SORT
        const sort = req.query.sort
        const { newSort } = sortProducts(sort)

        //GETTING CATEGORY AND PRODUCTS FROM THE DB
        const slug = req.params.slug;
        const category = await Category.findOne({ 'slug': slug })
        const products = await Product.find({ "category": category.id, "status": true })
            .select(['-cost']).sort(newSort).skip(skip).limit(pageSize);

        //MORE INFO FOR PAGINATION
        const total = await Product.find({ "category": category.id, "status": true }).countDocuments();
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
            category,
            products,
            count: products.length,
            page,
            pages
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        });
    }
}


//CREATE
const createCategory = async (req, res) => {
    try {

        const { name } = req.body;
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

        //SLUG
        const slug = slugify(name)
        category.slug = slug

        //SAVE CATEGORY
        await category.save();

        res.json({
            ok: true,
            category,
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
const updateCategory = async (req, res) => {
    try {

        const id = req.params.id;
        const category = await Category.findById(id);

        //VERIFY CATEGORY
        if (!category) {
            return res.status(404).json({
                ok: false,
                message: 'Category not found'
            });
        }

        //NEWDATA
        const slug = slugify(req.body.name)
        let newCategory = req.body
        newCategory.slug = slug

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
        await Category.findByIdAndUpdate(id, { status: false }, { new: true });

        res.json({
            ok: true,
            message: "Category deleted"
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
    getCategories,
    getProductByCategory,
    createCategory,
    updateCategory,
    deleteCategory
}