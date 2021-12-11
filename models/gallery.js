//REQUIRED
const { Schema, model } = require('mongoose');

//CODE
const GallerySchema = Schema(
    {

        url: { 
            type: String,
            required: true
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }

    },
    { timestamps: true }
);


GallerySchema.method('toJSON', function () {
    const { __v, _id, available, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Gallery', GallerySchema);