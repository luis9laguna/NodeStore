//REQUIRED
const { Schema, model } = require('mongoose');

//CODE
const ProductSchema = Schema(
    {

        name: {
            type: String,
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        image: {
            type: String
        },
        galery: [
            {
                type: String
            }
        ],
        status: {
            type: Boolean,
            required: true,
            default: true
        }

    },
    { timestamps: true }
);


ProductSchema.method('toJSON', function () {
    const { __v, _id, available, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Product', ProductSchema);