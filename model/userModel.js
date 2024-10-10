const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        required: true,
        default: "user",
        enum: ['host', 'guest', 'user','admin']
    },
    resetToken: {
        type: String
    },
    resetTokenExpiry:{
        type: Date
    }},
    {
        versionKey: false,
        timestamps: true
    
})
const user = mongoose.model('User', userSchema);

module.exports = user;