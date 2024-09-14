var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')


var taskSchema = new mongoose.Schema({
    assignedTo: String,
    status: String,
    date: Date,
    priority: String,
    description: String,
    ticked : Boolean
})

taskSchema.plugin(mongoosePaginate)
const task = mongoose.model('Task', taskSchema)

module.exports = task;