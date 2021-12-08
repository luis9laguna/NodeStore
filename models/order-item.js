//REQUIRED
const { Schema, model } = require('mongoose');

//CODE
const OrderItem = Schema(
    {
        products: [
            {
                product: {
                    type: Number
                },
                Quantity: {
                    type: Number
                }
            }
        ]
    },
    { timestamps: true }
);


OrderItem.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model('Order', OrderItem);