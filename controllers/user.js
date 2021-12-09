//REQUIRED
const User = require('../models/user'); 
const bcrypt = require('bcryptjs');

//CODE

//GET
const getUsers = async(req, res) =>{

    try{

        const users = await User.find({status: true, role: 'USER_ROLE'});
    
        res.json({
            ok: true,
            users,
            uid: req.uid
        });

    }catch(err){

        console.log(err);
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}

//CREATE
const createUser = async(req, res) => {

    try{
        
        const { email, password } = req.body;
        const existEmail = await User.findOne({email});

        //VERIFY EMAIL
        if(existEmail){
            return res.status(400).json({
                ok:false,
                message: "This email already exists."
            });
        }

        const user = new User(req.body);

        //ENCRYPT
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        //SAVE USER
        await user.save();
        
        res.json({
            ok: true,
            user
        });
        
    } catch(err){

        console.log(err);
        res.status(500).json({
            ok:false,
            message: "Error Unexpected, check logs"
        });

    }
}


//UPDATE    
const updateUser = async (req, res) =>{

    try{
        
        const uid = req.params.id;
        const userDB = await User.findById( uid );

        //VERIFY USER
        if(!userDB){
            return res.status(404).json({
                ok: false,
                message: "User not found"
            });
        }

        //UPDATE USER
        const { password, google, ...field } = req.body;
        const userUpdate = await User.findByIdAndUpdate( uid, field, { new : true } );
        
        res.json({
            ok:true,
            user: userUpdate
        });

    }catch(err){
        console.log(err);
        res.status(500).json({
            ok:false,
            message: "Error Unexpected, check logs"
        });
    }
}


//DELETE
const deleteUser = async (req, res) => {

    try{
        
        const uid = req.params.id;
        const userDB = await User.findById( uid );

        //VERIFY USER
        if(!userDB){
            return res.status(404).json({
                ok: false,
                message: "User not found"
            });
        }

        //DELETE USER
        userDB.status = false;
        await User.findByIdAndUpdate( uid, userDB );
        
        res.json({
            ok:true,
            message: "User deleted"
        });

    }catch(err){
        console.log(err);
        res.status(500).json({
            ok:false,
            message: "Error Unexpected, check logs"
        });
    }
}



module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}