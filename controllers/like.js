//REQUIRED
const Like = require('../models/like');


//CODE

//GET ALL LIKES BY USER
const getLikesByUser = async (req, res) => {

    try {
        const uid = req.params.id;
        const likesUser = await Like.find({"User": uid})

    
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

        //GIVING LIKE
        await data.save();

        res.json({
            ok: true,
            data
        });

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
        const uid = req.params.id;
        const LikeyDB = await Like.findById(uid);

        if (!LikeyDB) {
            return res.status(404).json({
                ok: false,
                message: 'Id not found'
            });
        }

        //GIVING DISLIKE
        await Like.findByIdAndDelete(uid);

        res.json({
            ok: true,
            message: "DISLIKE"
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
    giveDislike
}