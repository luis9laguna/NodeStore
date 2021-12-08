//REQUIRED
const mongoose = require('mongoose');

//CODE
const CartSchema = Schema(
    {

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        products: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ]
    },
    { timestamps: true }
);

Cart.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model('Cart', Cart);