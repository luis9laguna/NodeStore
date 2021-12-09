//REQUIRED
const { Schema, model } = require('mongoose');

//CODE
const UserSchema = Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true,
            default: 'USER_ROLE',
            enum: ['SUPER_ROLE', 'ADMIN_ROLE', 'USER_ROLE']
        },
        google: {
            type: Boolean,
            default: false
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true },
);


UserSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model('User', UserSchema);