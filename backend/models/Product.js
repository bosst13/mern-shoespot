const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name."],
        trim: true,
        maxLength: [100, "Product name cannot exceed up to 100 characters."]
    },
    description: {
        type: String,
        required: [true, "Please enter product description."]
    },
    price: {
        type: Number,
        required: [true, "Please enter product price."]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: false
            },
            url: {
                type: String,
                required: false
            }
        }
    ],
    brand: {
        type: String,
        required: [true, "Please enter product category."],
        enum: {
            values: [
                'Adidas',
                'Nike',
                'Converse',
            ],
            message: 'Please select correct category for product'
        }
    },
    status: {
        type: String,
        required: [true, "Please enter product status."],
        enum: {
            values: [
                'Available',
                'Unavailable'
            ],
            message: "Please select correct status."
        }
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product', productSchema);