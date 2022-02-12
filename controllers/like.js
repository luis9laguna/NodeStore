//REQUIRED
const User = require('../models/user');
const Product = require('../models/product');
const { sortProducts } = require('../helpers/sort-products');


//CODE

//GET ALL LIKES BY USER
const getLikesByUser = async (req, res) => {

    try {

        //GETTING INFO FOR PAGINATION
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;

        //SORTING SORT
        const sort = req.query.sort
        const { newSort } = sortProducts(sort)

        //GET USER CODE
        const userId = req.id;
        const user = await User.findById(userId)
        const uCode = user.ucode

        //GET PRODUCTS
        const products = await Product.find({ "likes": uCode }).skip(skip).limit(pageSize).sort(newSort);

        if (products == "") {
            return res.status(404).json({
                ok: false,
                message: "This user doesn't have likes"
            });
        }

        //MORE INFO FOR PAGINATION
        const total = await Product.find({ "likes": uCode }).countDocuments();
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
        const slug = req.params.slug;
        const product = await Product.findOne({ "slug": slug });

        const like = product.likes.includes(uCode)

        //LOOKING FOR LIKE
        if (like) product.likes.remove(uCode)
        else product.likes.push(uCode)


        //SAVE
        product.save()

        res.json({
            ok: true,
            product
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        });
    }
}

//GET ALL LIKES BY USER
const getProductsWithMoreLikes = async (req, res) => {

    try {

        const products = await Product.find().sort({ likes: '-1' })

        res.json({
            ok: true,
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




module.exports = {
    getLikesByUser,
    giveLikeAndDislike,
    getProductsWithMoreLikes

}