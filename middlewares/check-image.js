const checkImage = (req, res, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.images) {
        return res.status(400).json({
            message: 'There arent images to upload'
        });
    }

    next();

}
module.exports = {
    checkImage
}
