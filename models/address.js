//REQUIRED
const { Schema, model } = require('mongoose');

//CODE
const Address = Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    address: {

        labelAddress: {
            type: String
        },
        name: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        rut: {
            type: String,
            required: true
        },
        region: {
            type: String,
            required: true
        },
        provincia: {
            type: String,
            required: true
        },
        comuna: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        numStreet: {
            type: Number,
            required: true
        },
        infoHome: {
            type: Number
        },
        extraInfo: {
            type: String
        }
    }
}
);

Address.method('toJSON', function () {
    const { __v, ...object } = this.toObject();

    return object;
});

module.exports = model('Address', Address);