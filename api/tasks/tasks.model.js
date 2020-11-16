const { Schema, model } = require('mongoose');

const TaskModel = new Schema({
    title: String,
    price: Number,
    reward: Number,
    startDay: Date,
    finishDay: Date,
});

module.exports = model('Tasks', TaskModel);
