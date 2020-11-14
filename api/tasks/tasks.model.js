const { Schema, model } = require('mongoose')

const TaskModel = new Schema({
    title: String,
    price: Number,
    timeToDo: Date
})

//luxon
module.exports = model('Tasks', TaskModel)
