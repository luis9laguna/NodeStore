//REQUIRED
const User = require('../models/user');
const Product = require('../models/product');
const { sortProducts } = require('../helpers/sort-products');


//CODE

//GET ALL LIKES BY USER
const getLikesByUser = async (req, res) => {

    try {
        //GET USER CODE
        const userId = req.id;
        const user = await User.findById(userId)
        const uCode = user.ucode

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
            { $match: { "category.status": true, "status": true, "likes": uCode } },
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
            message: 'Unexpected Error'
        });
    }
}


//GIVE A LIKE
const giveLikeAndDislike = async (req, res) => {
    try {

        //GET USER CODE
        const userId = req.id;
        const user = await User.findById(userId)
        const uCode = user.ucode

        //GET PRODUCT
        const id = req.params.id;
        const product = await Product.findById(id);

        //LOOKING FOR LIKE
        const like = product.likes.includes(uCode)
        if (like) product.likes.remove(uCode)
        else product.likes.push(uCode)

        //SAVE
        product.save()

        res.json({
            ok: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        });
    }
}

//GET ALL LIKES BY USER
const getProductsWithMoreLikes = async (req, res) => {

    try {
        const limit = parseInt(req.query.limit) || 10

        //DB QUERY
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
            { $sort: { likes: -1 } },
            { $limit: limit }
        ])

        res.json({
            ok: true,
            products
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        });
    }
}




module.exports = {
    getLikesByUser,
    giveLikeAndDislike,
    getProductsWithMoreLikes

}