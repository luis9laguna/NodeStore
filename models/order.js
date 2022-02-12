//REQUIRED
const { Schema, model } = require('mongoose');

//CODE
const OrderSchema = Schema(
    {
        code: {
            type: String,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        address: {
            type: Schema.Types.ObjectId,
            ref: 'Address',
            required: true
        },
        totalCost: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            default: "pending",
            enum: ['pending', 'processing', 'shipping', 'delivered']
        },
        orderItems: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Order-Items',
                required: true
            }
        ],
        shipping: {
            type: Number,
            default: 3500
        }
    },
    { timestamps: true }
);


OrderSchema.method('toJSON', function () {
    const { __v, ...object } = this.toObject();

    return object;
});

module.exports = model('Order', OrderSchema);