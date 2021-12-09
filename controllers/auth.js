//REQUIRED
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generatorJWT } = require('../helpers/jwt');

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


const renewToken = async (req, res) => {

    const uid = req.uid;
    const user = await User.findById( uid );
    const token = await generatorJWT( uid );

    res.json({
        ok:true,
        token,
        user
    });
}


module.exports = {
    login, renewToken
}
