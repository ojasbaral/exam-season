const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Project = require('../models/projectModel')

const userSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        max: 20,
        min: 8,
        required: true
    },
    name: String,
    _projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }]
})


const User = mongoose.model('User', userSchema)
module.exports = User
