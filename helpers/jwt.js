const jwt = require('jsonwebtoken');

const generatorJWT = (id, role, expire) => {

    return new Promise((resolve, reject) => {

        const payload = {
            id,
            role
        };

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: expire
        }, (error, token) => {
            if (error) {
                reject('Sorry')
            } else {
                resolve(token);
            }
        });
    });
}

module.exports = {
    generatorJWT
}