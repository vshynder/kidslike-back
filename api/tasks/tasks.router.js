const { Router } = require('express');
const tasksController = require('./tasks.controller')

const router = Router();

router.post('/addTask', tasksController.addTaskValidation, tasksController.addTask)

module.exports = router;
