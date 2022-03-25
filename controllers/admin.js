//REQUIRED
const User = require('../models/user');
const bcrypt = require('bcryptjs');

//CODE

//GET ALL ADMINS

const getAdmins = async (req, res) => {

    try {
        //DB QUERY
        const query = User.find({ status: true, role: 'ADMIN_ROLE' })

        //REQUESTS
        const page = parseInt(req.query.page) || 1
        const pageSize = parseInt(req.query.limit) || 10

        //GETTING PAGINATION AND DATA
        const skip = (page - 1) * pageSize;
        let total = await query
        total = total.length
        const pages = Math.ceil(total / pageSize)

        //GETTING DATA FROM THE DB
        let data = await query.skip(skip).limit(pageSize).clone()

        res.json({
            ok: true,
            allUsers: data,
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


//CREATE
const createAdmin = async (req, res) => {

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
        user.role = 'ADMIN_ROLE';
        await user.save();

        res.json({
            ok: true,
            user
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });

    }
}


//UPDATE    
const updateAdmin = async (req, res) => {

    try {
        const id = req.params.id;
        const userDB = await User.findById(id);

        //VERIFY USER
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                message: "Admin not found"
            });
        }

        //UPDATE USER
        const { password, google, ...field } = req.body;
        const userUpdate = await User.findByIdAndUpdate(id, field, { new: true });

        res.json({
            ok: true,
            admin: userUpdate
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}


//DELETE ADMIN
const deleteAdmin = async (req, res) => {

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
        await User.findByIdAndDelete(id);

        res.json({
            ok: true,
            message: "User deleted"
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}


module.exports = {
    getAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin
}