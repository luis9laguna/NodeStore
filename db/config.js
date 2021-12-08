//REQUIRED
const mongoose = require('mongoose');


//CODE
const dbConnection = async() => {
    try {
        await mongoose.connect ( process.env.DB_CN,{
            useNewUrlParser: true, 
            useUnifiedTopology: true
        })
    }
    catch (error){
        console.log(error)
        throw new Error('Database connection error');
    }
}


module.exports = {
    dbConnection
}