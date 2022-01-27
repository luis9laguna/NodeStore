//REQUIRED
const Category = require('../models/category');
const Product = require('../models/product');
const slugify = require('slugify')
const { v4: uuidv4 } = require('uuid');
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

        const slug = req.params.slug;
        const category = await Category.findOne({ 'slug': slug })
        const products = await Product.find({ "category": category.id, "status": true }).sort('name');

        res.json({
            ok: true,
            category,
            products
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
        const existCategory = await Category.findOne({ name });

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