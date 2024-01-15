const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Ente product Name"]
    },
    description: {
        type: String,
        required: [true, "Please Ente product descriptiion"]
    },
    price: {
        type: Number,
        required: [true, "Please Ente product Price"],
        maxLength: [8, "Price cannor be exceded 8 characters"]
    },
    rating: {
        type: Number,
        required: [true, "Please Ente product Name"],
        default:0
    },
    images:[
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please Ente product catrgory"]
    },
    stock: {
        type: Number,
        required: [true, "Please Ente product Stock"],
        maxLength: [4, "Stock not exceed  charaacters"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }


})

module.exports = mongoose.model("product", productSchema)