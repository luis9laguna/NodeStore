//REQUIRED
const Category = require('../models/category');
const Product = require('../models/product');
const path = require('path');
const cloudinary = require('cloudinary').v2

cloudinary.config(process.env.CLOUDINARY_URL);


//CODE

//POST IMAGE
const updateImage = async(req, res = response ) => {

    const { id, collection } = req.params;

    let model;

    switch ( collection ) {
        case 'product':
            model = await Product.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `It doesnt exist any product with ${ id }`
                });
            }
        
        break;

        case 'category':
            model = await Category.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `It doesnt exist any category with ${ id }`
                });
            }
        
        break;
    
        default:
            return res.status(500).json({ msg: 'wut?'});
    }


    // Cleaning the outdated photos
    if ( model.image ) {
        const nameArray = model.image.split('/');
        const name = nameArray[ nameArray.length - 1 ];
        const [ public_id ] = name.split('.');
        cloudinary.uploader.destroy( public_id );
    }


    const { tempFilePath } = req.files.image;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    model.image = secure_url;

    await model.save();


    res.json( model );

}

module.exports ={
    updateImage
}