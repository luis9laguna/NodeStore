//REQUIRED
const { Schema, model } = require('mongoose');

//CODE
const DiscountSchema = Schema(
    {

        code: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        typeAllProducts: {
            type: Boolean, // all product s
            default: false,
            required: true
        },
        typeSelected : {
            type: String  // category or product
        },
        forProducts: [
            {
                type: Schema.Types.ObjectId, //specific products
                ref: 'Product'
            }
        ],
        forCategories: [
            {
                type: Schema.Types.ObjectId, //specific categories
                ref: 'Category'
            }
        ],
        couponAmount: {
            type: Number
        },
        usesPerUser: {
            type: Number
        },
        usesPerItems: {
            type: Number
        },
        usesCoupon: {
            type: Number
        },
        minimumSpend: {
            type: Number
        },
        minimumItems: {
            type: Number
        },
        excludeProducts: [
            {
                type: Schema.Types.ObjectId, //exclude products
                ref: 'Product'
            }
        ],
        excludeCategories: [
            {
                type: Schema.Types.ObjectId, //exclude categories
                ref: 'Category'
            }
        ],
        percentage: {
            type: Boolean,
            default: false,
            required:true
        },
        freeShipping: {
            type: Boolean,
            default: false,
            required:true
        },
        status: {
            type: Boolean,
            required: true,
            default: true
        },
        expireDate: { 
            type: String, 
            require: true, 
            default: "" 
        }

    },
    { timestamps: true }
);

DiscountSchema.method('toJSON', function () {
    const { __v, ...object } = this.toObject();


    return object;
});

module.exports = model('Discount', DiscountSchema);