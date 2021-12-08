//REQUIRED
const { Schema, model } = require('mongoose');

//CODE
const UserAdress = Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    address: [
        {
            phone: {
                type: Number,
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
            }
        }
    ]
}
);

UserAdress.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model('UserAdress', UserAdress);