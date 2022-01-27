//REQUIRED
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generatorJWT } = require('../helpers/jwt');

//CODE


//GET
const getUser = async (req, res) => {
    try {
        const id = req.id
        const userDB = await User.findById(id);

        //VERIFY USER
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                message: "User not found"
            });
        }

        res.json({
            ok: true,
            user: {
                name: userDB.name,
                role: userDB.role
            }
        });

    } catch (err) {
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}

//GET ALL USERS
const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.countDocuments();

        res.json({
            ok: true,
            total: allUsers
        });

    } catch (err) {
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}

//CREATE
const createUser = async (req, res) => {

    try {

        const { email, password } = req.body;
        const existEmail = await User.findOne({ email });

        //VERIFY EMAIL
        if (existEmail) {
            return res.status(400).json({
                ok: false,
                message: "This email already exists."
            });
        }

        const user = new User(req.body);

        //ENCRYPT
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        //SAVE USER
        await user.save();

        const expire = '12h'
        //GENERATE TOKEN
        const token = await generatorJWT(user.id, user.role, expire);
        res.json({
            ok: true,
            user,
            token
        });

    } catch (err) {
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });

    }
}


//UPDATE    
const updateUser = async (req, res) => {

    try {

        const id = req.id
        const userDB = await User.findById(id);

        //VERIFY USER
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                message: "User not found"
            });
        }

        //UPDATE USER
        const { password, google, ...field } = req.body;
        const userUpdate = await User.findByIdAndUpdate(id, field, { new: true });

        res.json({
            ok: true,
            user: userUpdate
        });

    } catch (err) {
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}


//DELETE
const deleteUser = async (req, res) => {

    try {

        const id = req.params.id;
        const userDB = await User.findById(id);

        //VERIFY USER
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                message: "User not found"
            });
        }

        //DELETE USER
        userDB.status = false;
        await User.findByIdAndUpdate(id, userDB);

        res.json({
            ok: true,
            message: "User deleted"
        });

    } catch (err) {
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}



module.exports = {
    getUser,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
}