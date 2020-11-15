const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    data : {
        type: Date,
        required: true,
        default : Date.now
    },
})

module.exports = mongoose.model('User', UserSchema)