//REQUIRED
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generatorJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

//CODE
const login = async(req, res) => {
    try {

        const { email, password } = req.body;
        const userDB = await User.findOne({email});

        //VERIFY EMAIL
        if(!userDB){
            return res.status(404).json({
                ok:false,
                message:'Email not found'
            });
        }

        //VERIFY PASSWORD
        const validPassword = bcrypt.compareSync(password, userDB.password);

        if(!validPassword){
            return res.status(400).json({
                ok:false,
                message:'Invalid Password'
            });
        }

        //GENERATE TOKEN
        const token = await generatorJWT(userDB.id, userDB.role);

        res.json({
            ok:true,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}

const googleSignIn = async (req, res) => {

    const tokenGoogle = req.body.token;

    try {
        
        const { name, email } = await googleVerify(tokenGoogle);
        let user = await User.findOne({ email });

        
        if ( !user ) {
            // CREATE
            const data = {
                name,
                email,
                password: 'none',
                google: true
            };

            user = new User( data );
            await user.save();
        }

        // IF THE USER HAS STATE: FALSE
        if ( !user.status ) {
            return res.status(401).json({
                message: 'blocked user, talk to the administrator'
            });
        }

        // JWT
        const token = await generatorJWT( user.id );


        res.json({
            message: 'User logged',
            token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
        
}

//PETITION RESET PASSWORD
const forgetEmail = async(req, res) => {


    try {
        
    } catch (error) {
        res.status(400).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}


//RESET PASSWORD
const resetPassword = async(req, res) => {


    try {
        
    } catch (error) {
        res.status(400).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}
module.exports = {
    login,
    googleSignIn,
    forgetEmail,
    resetPassword
}
