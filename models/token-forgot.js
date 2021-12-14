//REQUIRED
const { Schema, model } = require('mongoose');

//CODE
const TokenForgotSchema = Schema(
    {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            token: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now,
                expires: 3600
            }

    },
    { timestamps: true }
);

TokenForgotSchema.method('toJSON', function () {
    const { __v, ...object } = this.toObject();

    return object;
});

module.exports = model('TokenForgot', TokenForgotSchema);