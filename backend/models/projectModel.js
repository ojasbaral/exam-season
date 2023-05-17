const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('../models/userModel')
const Exam = require('../models/examModel')

const projectSchema = new Schema({
    _user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    _exams: [{
        type: Schema.Types.ObjectId,
        ref: 'Exam' 
    }]},  
    { timestamps: true})
/*
projectSchema.pre('remove', async (next) => {
    try{
        this.owner._projects.pull( { _id: this._id } )
        await this._user.save()
        next()
    } catch (e) {
        console.log(e)
    }

})
*/


const Project = mongoose.model('Project', projectSchema)
module.exports = Project