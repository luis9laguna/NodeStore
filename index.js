//REQUIRED
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./db/config');


//SERVER
const app = express();


//CORS
app.use(cors());

//READ BODY
app.use( express.json() );

//DATABASE
dbConnection();

//ROUTES

app.use('/api/category', require('./routes/categories'));
app.use('/api/product', require('./routes/products'));
app.use('/api/search', require('./routes/search'));
app.use('/api/user', require('./routes/user'));




//LISTEN
app.listen(process.env.PORT, () => {
    console.log('Server in ' + process.env.PORT)
})