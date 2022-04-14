//REQUIRED
const jwt = require('jsonwebtoken');
//CODE

//VERIFY JWT USER
const checkJWT = (req, res, next) => {

    try {

        // const token = req.cookies.token;
        const token = req.header('Authorization');

        //VERIFY TOKEN
        if (!token) {
            return res.status(401).send({
                ok: false,
                message: 'Needed token'
            });
        }

        //GET ID AND ROLE
        const { id, role } = jwt.verify(token, process.env.JWT_SECRET);
        req.id = id;
        req.role = role;

        next();

    } catch (error) {
        return res.status(401).send({
            ok: false,
            message: 'Token Invalid'
        });
    }
}

//VERIFY JWT SUPER
const checkSuper = async (req, res, next) => {

    const role = req.role;

    if (role === "SUPER_ROLE") {
        next();
    } else {
        return res.status(401).send({
            ok: false,
            message: 'This user is not a super'
        });
    }
}

//VERIFY JWT ADMIN
const checkAdmin = async (req, res, next) => {

    const role = req.role;

    if (role === "ADMIN_ROLE" || role == "SUPER_ROLE") {
        next();
    } else {
        return res.status(401).send({
            ok: false,
            message: 'This user is not an admin'
        });
    }
}

module.exports = {
    checkJWT,
    checkSuper,
    checkAdmin
}