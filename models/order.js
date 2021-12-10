//REQUIRED
const { Schema, model } = require('mongoose');

//CODE
const OrderSchema = Schema(
    {

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
                ref: 'User',
                required: true
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