const jwt = require('jsonwebtoken');

const generatorJWT = (uid, role) => {

    return new Promise ( (resolve, reject) =>{
    
        const payload = {
            uid,
            role
        };

        jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, (error, token) => {
            if (error){
                console.log(error);
                reject('Sorry')
            } else {
                resolve ( token );
            }
        });
    });
}

module.exports = {
    generatorJWT
}