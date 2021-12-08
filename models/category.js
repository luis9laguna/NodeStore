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
            type: String
        },
        status: {
            type: Boolean,
            required: true,
            default: true
        }

    },
    { timestamps: true },
    { collection: "categories"}
);

CategorySchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model ('Category', CategorySchema);