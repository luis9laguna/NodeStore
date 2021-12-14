//REQUIRED
const User = require('../models/user');
const TokenForgot = require('../models/token-forgot');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generatorJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { sendEmail } = require('../helpers/send-email');

//CODE
const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        const userDB = await User.findOne({ email });

        //VERIFY EMAIL
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                message: 'Email not found'
            });
        }

        //VERIFY PASSWORD
        const validPassword = bcrypt.compareSync(password, userDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                message: 'Invalid Password'
            });
        }
        const expire = '12h'
        //GENERATE TOKEN
        const token = await generatorJWT(userDB.id, userDB.role, expire);

        res.json({
            ok: true,
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


        if (!user) {
            // CREATE
            const data = {
                name,
                email,
                password: 'none',
                google: true
            };

            user = new User(data);
            await user.save();
        }

        // IF THE USER HAS STATE: FALSE
        if (!user.status) {
            return res.status(401).json({
                message: 'blocked user, talk to the administrator'
            });
        }

        const expire = '12h'
        const role = "USER_ROLE"
        // JWT
        const token = await generatorJWT(user.id, role, expire);


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
const forgetEmail = async (req, res) => {


    try {

        const email = req.body.email;

        //VALIDATION OF USER
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                ok: false,
                message: 'User not found'
            });
        }


        const { name, id, role, google } = user;

        //VALIDATION OF USER WITH GOOGLE
        if (google) {
            return res.status(404).json({
                ok: false,
                message: 'This user is register with google not by email and password.'
            });
        }

        //CODE
        const expire = '60m';
        const token = await generatorJWT(id, role, expire);
        const verificationLink = `http://localhost:3000/auth/password-reset/${token}`
        const subject = `Password Reset Request For ${name}`;
        const text = `Hi ${name}, here is your link to change the password ${verificationLink}`;
        const tokenForgot = new TokenForgot({ user: id, token });


        //VALIDATION OF TOKENDB
        const tokenDB = await TokenForgot.findOne({ user: id });
        if (tokenDB) {
            await tokenDB.delete();
        }

        //SAVE TOKEN AND SEND EMAIL
        await tokenForgot.save();

        //SEND EMAIL
        await sendEmail(email, subject, text);

        res.json({
            message: 'Email send successfully'
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}


//RESET PASSWORD
const resetPassword = async (req, res) => {


    try {

        const token = req.params.token;
        const newPassword = req.body.password;

        //GET PARAMS FROM THE TOKEN
        const { id } = jwt.verify(token, process.env.JWT_SECRET);

        //CODE
        const salt = bcrypt.genSaltSync();
        const password = bcrypt.hashSync( newPassword, salt );
        
        //UPDATE PASSWORD
        await User.findByIdAndUpdate(id, {password});

        //DELETE TOKEN
        await TokenForgot.findOneAndRemove({ token });

        res.json({
            ok:true,
            message:"Password changed correctly",
        });

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
