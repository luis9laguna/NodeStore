//REQUIRED
const { Schema, model } = require('mongoose');

//CODE
const Order = Schema(
    {

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        userAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserAdress',
            required: true
        },
        total: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            default: "pending"
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                Quantity: {
                    type: Number
                }
            }
        ]
    },
    { timestamps: true }
);


OrderSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model('Order', OrderSchema);