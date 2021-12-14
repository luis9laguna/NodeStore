//REQUIRED
const Category = require('../models/category');
const Product = require('../models/product');
const Gallery = require('../models/gallery');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2

cloudinary.config(process.env.CLOUDINARY_URL);


//CODE

//GET GALLERY BY PRODUCT

const getGalleryByProduct = async (req, res) => {

    try {

        const id = req.params.id;
        const gallery = await Gallery.find({"product": id});

        if (!gallery) {
            return res.status(404).json({
                ok: false,
                message: 'Gallery not found'
            });
        }
    
        res.json({
            ok: true,
            gallery
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        });
    }
}




//POST IMAGE
const updateImage = async (req, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'product':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `It doesnt exist any product with ${id}`
                });
            }

            break;

        case 'category':
            model = await Category.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `It doesnt exist any category with ${id}`
                });
            }

            break;

        default:
            return res.status(500).json({ msg: 'wut?' });
    }


    // CLEANING OUTDATED PHOTOS

    const nameArray = model.image.split('/');
    const name = nameArray[nameArray.length - 1];
    const [public_id] = name.split('.');
    cloudinary.uploader.destroy(`${collection}/${model.name}/${public_id}`);


    const { tempFilePath } = req.files.image;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { public_id: `${collection}/${model.name}/${uuidv4()}`});
    model.image = secure_url;

    await model.save();

    res.json(model);

}

//UPLOAD GALLERY

const uploadGallery = async (req, res) => {
    
    const id = req.params.id;
    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({
            ok: false,
            message: 'Product not found'
        });
    }

    const name = product.name;
    let gallery = new Gallery();

    const { tempFilePath } = req.files.image;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { public_id: `product/${name}/gallery/${uuidv4()}` });
    gallery.url = secure_url;
    gallery.product = id;

    //SAVE
    gallery.save();

    res.json(gallery);

}

//DELETE PHOTO OF GALLERY
const DeletePhotoGallery = async (req, res) => {

    const id = req.params.id;
    const photo = await Gallery.findById(id);

    if (!photo) {
        return res.status(404).json({
            ok: false,
            message: 'Photo not found'
        });
    }
    const idProduct = photo.product;
    const product = await Product.findById(idProduct);

    if (!product) {
        return res.status(404).json({
            ok: false,
            message: 'Product not found'
        });
    }
    const productName = product.name;

    const nameArray = photo.url.split('/');
    const name = nameArray[nameArray.length - 1];
    const [public_id] = name.split('.');

    //DELETE
    cloudinary.uploader.destroy(`products/${productName}/gallery/${public_id}`);

    await Gallery.findByIdAndDelete(id);
    console.log(public_id);

    res.json({
        ok: true,
        message: "File Eliminated"
    });

}
module.exports = {
    getGalleryByProduct,
    updateImage,
    uploadGallery,
    DeletePhotoGallery
}