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
            default: "https://res.cloudinary.com/faisca/image/upload/v1639115747/noimage_fa8wdn.jpg"
        },
        status: {
            type: Boolean,
            required: true,
            default: true
        }

    },
    { timestamps: true }
);

CategorySchema.method('toJSON', function(){
    const {__v, ...object} = this.toObject();


    return object;
});

module.exports = model ('Category', CategorySchema);