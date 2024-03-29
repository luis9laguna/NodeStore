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
        cost: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        sale: {
            type: Number,
            required: true,
            default: 0
        },
        stock: {
            type: Number,
            required: true
        },
        images: [
            {
                type: String,
                required: true
            }
        ],
        slug: {
            type: String,
            required: true
        },
        likes: [
            {
                type: String,
                required: true
            },
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
    const { __v, available, ...object } = this.toObject();

    return object;
});

module.exports = model('Product', ProductSchema);