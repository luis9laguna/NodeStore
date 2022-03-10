const Category = require('../models/category');
const Product = require('../models/product');


const getAllProductsDashboard = async (req, res) => {
    try {
        //DB QUERY
        const query = Product.find().populate('category', 'name status -_id')

        //REQUESTS
        let sort = req.query.sort
        sort = sort === undefined ? -1 : (sort === "true" ? -1 : 1)
        const page = parseInt(req.query.page) || 1
        const pageSize = parseInt(req.query.limit) || 15

        //GETTING PAGINATION AND DATA
        const skip = (page - 1) * pageSize;
        let total = await query;
        total = total.length
        const pages = Math.ceil(total / pageSize)

        //IF NO DATA
        if (page > pages) return res.status(404).json({ status: 'false', message: "Page/Data not found" })

        //GETTING DATA FROM THE DB
        let data = await query.sort({ status: sort }).skip(skip).limit(pageSize).clone()

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

const getCategoriesDashboard = async (req, res) => {

    try {

        //REQUESTS
        let sort = req.query.sort
        sort = sort === undefined ? -1 : (sort === "true" ? -1 : 1)

        const categories = await Category.find().sort({ status: sort });

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
const getProductsByCategoryDashboard = async (req, res) => {

    try {
        //GETTING CATEGORY FROM THE DB
        const id = req.params.id;
        const category = await Category.findById(id)

        if (!category) {
            return res.status(404).json({
                ok: false,
                message: 'Category not found'
            });
        }

        //DB QUERY
        const query = Product.find({ "category": category._id }).populate('category', 'name status -_id')

        //REQUESTS
        let sort = req.query.sort
        sort = sort === undefined ? -1 : (sort === "true" ? -1 : 1)
        const page = parseInt(req.query.page) || 1
        const pageSize = parseInt(req.query.limit) || 15

        //GETTING PAGINATION AND DATA
        const skip = (page - 1) * pageSize;
        let total = await query;
        total = total.length
        const pages = Math.ceil(total / pageSize)

        //IF NO DATA
        if (page > pages) return res.status(404).json({ status: 'false', message: "Page/Data not found" })

        //GETTING DATA FROM THE DB
        let data = await query.sort({ status: sort }).skip(skip).limit(pageSize).clone()

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

const getSearchDashboard = async (req, res) => {

    try {
        //TERM AND REGEX
        const term = req.params.term;
        const regex = new RegExp(term, 'i')

        //DB QUERY
        const query = Product.find({ $or: [{ name: regex }, { description: regex }] })
            .populate('category', 'name status -_id')

        //REQUESTS
        let sort = req.query.sort
        sort = sort === undefined ? -1 : (sort === "true" ? -1 : 1)
        const page = parseInt(req.query.page) || 1
        const pageSize = parseInt(req.query.limit) || 15

        //GETTING PAGINATION AND DATA
        const skip = (page - 1) * pageSize;
        let total = await query;
        total = total.length
        const pages = Math.ceil(total / pageSize)

        //IF NO DATA
        if (page > pages) return res.status(404).json({ status: 'false', message: "Page/Data not found" })

        //GETTING DATA FROM THE DB
        let data = await query.sort({ status: sort }).skip(skip).limit(pageSize).clone()

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


module.exports = {
    getAllProductsDashboard,
    getCategoriesDashboard,
    getProductsByCategoryDashboard,
    getSearchDashboard
}