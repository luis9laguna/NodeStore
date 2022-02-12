//REQUIRED
const Product = require('../models/product');
const Category = require('../models/category');
const { sortProducts } = require('../helpers/sort-products');

//CODE


const searchAll = async (req, res) => {

    try {

        const term = req.params.term;
        const regex = new RegExp(term, 'i')

        const [products, categories] = await Promise.all([

            Product.find({ name: regex }, { status: true }),
            Category.find({ name: regex }, { status: true })
        ]);

        res.json({
            ok: true,
            products,
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


//SEARCH ONE
const SearchOne = async (req, res) => {

    try {

        //GETTING INFO FOR PAGINATION
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;

        //SORTING SORT
        const sort = req.query.sort
        const { newSort } = sortProducts(sort)

        //GETTING COLLECTION FOR THE QUERY
        const collection = req.params.collection;
        const term = req.params.term;
        const regex = new RegExp(term, 'i')
        let data = [];
        let total = [];

        //GETTING DATA FROM DB
        switch (collection) {

            case 'product':
                data = await Product.find({
                    $or: [{ name: regex }, { description: regex }],
                    $and: [{ status: true }]
                }).select(['-cost']).skip(skip).limit(pageSize).sort(newSort);


                //MORE INFO FOR PAGINATION
                total = await Product.find({
                    $or: [{ name: regex }, { description: regex }],
                    $and: [{ status: true }]
                }).countDocuments();


                break;

            case 'category':

                data = await Category.find({ name: regex }, { status: true }).skip(skip).limit(pageSize);

                //MORE INFO FOR PAGINATION
                total = await Category.find({ name: regex }, { status: true }).countDocuments();

                break;

            default:
                res.status(400).json({
                    ok: false,
                    message: "The params has to be 'product' or 'category'"
                });
        }

        //MORE INFO FOR PAGINATION
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
            products: data,
            count: data.length,
            page,
            pages
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}

module.exports = {
    searchAll,
    SearchOne
}