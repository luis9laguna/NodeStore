//REQUIRED
const cloudinary = require('cloudinary').v2

//CODE
cloudinary.config(process.env.CLOUDINARY_URL);

//POST IMAGE
const uploadImage = async (req, res) => {

    try {
        const imagesReq = req.files.images
        if (imagesReq) {
            //SAVING IN CLOUDINARY
            let images = new Array
            if (imagesReq.length === undefined) {
                const { tempFilePath } = imagesReq;
                const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
                images = [secure_url]
            } else {
                for (const image of imagesReq) {
                    const { tempFilePath } = image;
                    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
                    images.push(secure_url)
                }
            }
            res.json({
                ok: true,
                images
            });
        } else {
            return res.status(404).json({
                ok: false,
                message: 'Images not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        });
    }
}


//DELETE PHOTO OF GALLERY
const deleteImage = async (req, res) => {

    try {
        const images = req.body.checkedImages

        if (images) {
            for (const image of images) {
                const nameArray = image.split('/');

                //REGEX TO KNOW IF THE IMAGES ARE IN FOLDER OR NOT
                const regex = /categories|products/.test(nameArray)
                let public_id
                if (regex) {
                    const cutArray = nameArray.splice(-3);
                    const name = cutArray.join('/')
                    public_id = name.split('.')[0];
                } else {
                    const name = nameArray[nameArray.length - 1];
                    public_id = name.split('.')[0];
                }

                //DELETE
                cloudinary.uploader.destroy(public_id);
            }
            res.json({
                ok: true,
                message: "Image eliminated"
            });
        } else {
            return res.status(404).json({
                ok: false,
                message: 'Images not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        });
    }
}
module.exports = {
    uploadImage,
    deleteImage
}