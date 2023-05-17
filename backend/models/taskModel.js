const mongoose = require('mongoose')
const Schema = mongoose.Schema


const projectSchema = new Schema({
    _parent_task: {
        type: Schema.Types.ObjectId,
        ref: 'Parent_Task',
        required: true
    },
    _child_tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Child_Tasks'
    }],
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        max: 200
    },
    optional_date: Date,
    completed: {
        type: Boolean,
        default: false
    }
    },  
    { timestamps: true})


const Task = mongoose.model('Task', taskSchema)
module.exports = Task