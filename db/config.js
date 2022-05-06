//REQUIRED
const mongoose = require('mongoose');


//CODE
const dbConnection = () => {
    try {
        mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }
    catch (error) {
        throw new Error('Database connection error');
    }
}


module.exports = {
    dbConnection
}