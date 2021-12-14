//REQUIRED
const Like = require('../models/like');


//CODE

//GET ALL LIKES BY USER
const getLikesByUser = async (req, res) => {

    try {
        const id = req.params.id;
        const likesUser = await Like.find({ "user": id })


        if (likesUser == "") {
            return res.status(404).json({
                ok: false,
                message: "This user doesnt have likes"
            });
        }

        res.json({
            ok: true,
            likesUser
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        });
    }
}


//GIVE A LIKE
const giveLike = async (req, res) => {
    try {

        const data = new Like(req.body);
        const user = req.body.user;
        const product = req.body.product;
        const like = await Like.find({ "product": product, "user": user });

        //VALIDATION TO SEE IF A PRODUCT ALREADY HAVE A LIKE FOR A SPECIFIC USER
        if (like == "") {

            //GIVING LIKE
            await data.save();

            res.json({
                ok: true,
                data
            });

        } else {
            return res.status(404).json({
                ok: false,
                message: "This user have already liked this product"
            });
        }





    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        });
    }
}

//GIVE A DISLIKE
const giveDislike = async (req, res) => {
    try {

        const id = req.params.id;
        const like = await Like.findById(id);

        //VERIFY LIKE

        if (like == "" || !like) {
            return res.status(404).json({
                ok: false,
                message: 'Id not found'
            });
        }

        await Like.findByIdAndDelete(id);

        res.json({
            ok: true,
            message: "Like eliminated"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}


//TOTAL LIKES BY PRODUCT

const likesProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const LikeDB = await Like.countDocuments({ "product": id })

        res.json({
            ok: true,
            LikeDB
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
    getLikesByUser,
    giveLike,
    giveDislike,
    likesProduct
}