//REQUIRED
const { Schema, model } = require('mongoose');

//CODE
const CategorySchema = Schema(
    {

        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true,
            default: 'https://res.cloudinary.com/bestecommerce/image/upload/v1668298542/default/default/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp_llrbwu.jpg'
        },
        slug: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            required: true,
            default: true
        }

    },
    { timestamps: true }
);

CategorySchema.method('toJSON', function () {
    const { __v, ...object } = this.toObject();


    return object;
});

module.exports = model('Category', CategorySchema);