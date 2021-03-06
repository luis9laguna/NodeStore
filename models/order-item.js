//REQUIRED
const { Schema, model } = require('mongoose');

//CODE
const OrderItems = Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true
        }
});


OrderItems.method('toJSON', function () {
    const { __v, ...object } = this.toObject();

    return object;
});

module.exports = model('Order-Items', OrderItems);