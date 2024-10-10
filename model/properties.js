const mongoose = require('mongoose');

const properties = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    propertyName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: [String]
    },
    date: {
        type: Date,
        default: Date.now()
    },
    price: {
        type: mongoose.Decimal128,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amenities: {
        type: String,
        required: true
    }
},
{ timestamps: true,
    versionKey: false
});

const Property = mongoose.model('Property',properties)

module.exports = Property;