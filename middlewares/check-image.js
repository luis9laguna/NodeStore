const checkImage = (req, res = response, next ) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.image ) {
        return res.status(400).json({
            message: 'There arent images to upload'
        });
    }

    next();

}


module.exports = {
    checkImage
}
