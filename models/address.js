//REQUIRED
const { Schema, model } = require('mongoose');

//CODE
const Address = Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    address: {

        addressname: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        id: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        province: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        numstreet: {
            type: Number,
            required: true
        },
        apartment: {
            type: Number
        }
    }
}
);

Address.method('toJSON', function () {
    const { __v, ...object } = this.toObject();

    return object;
});

module.exports = model('Address', Address);