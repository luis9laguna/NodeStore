//REQUIRED
const { Schema, model } = require('mongoose');

//CODE
const LikeSchema = Schema(
    {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }

    },
    { timestamps: true }
);

LikeSchema.method('toJSON', function () {
    const { __v, ...object } = this.toObject();

    return object;
});

module.exports = model('Like', LikeSchema);