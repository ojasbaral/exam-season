const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Project = require('../models/projectModel')
const User = require('../models/userModel')

const examSchema = new Schema({
    _project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    _user: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    class: {
        type: String,
        required: true
    },
    exam_name: {
        type: String,
        required: true
    },
    exam_date: {
        type: Date,
    },
    description: {
        type: String,
        max: 200
    },
    _tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Tasks' 
    }]},  
    { timestamps: true})


const Exam = mongoose.model('Exam', examSchema)
module.exports = Exam