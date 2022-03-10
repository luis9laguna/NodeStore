//REQUIRED
const Product = require('../models/product');
const { sortProducts } = require('../helpers/sort-products');

//CODE

//SEARCH
const searchProducts = async (req, res) => {

    try {
        //TERM AND REGEX
        const term = req.params.term;
        const regex = new RegExp(term, 'i')

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
            { $match: { "category.status": true, "status": true, $or: [{ "name": regex }, { "description": regex }] } },
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

module.exports = {
    searchProducts
}