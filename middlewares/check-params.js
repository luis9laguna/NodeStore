//REQUIRED
const { validationResult } = require('express-validator');

//CODE
const checkParams = (req, res, next) =>{

    const errors =  validationResult( req );

    if ( !errors.isEmpty() ){
        return res.status(400).json({
            ok:false,
            errors: errors.mapped()
        });
    }

    next();

}

module.exports = {
    checkParams
}