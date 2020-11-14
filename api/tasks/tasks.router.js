const { Router } = require('express');
const tasksController = require('./tasks.controller')

const router = Router();

router.post('/addTask', tasksController.addTaskValidation, tasksController.addTask)
router.patch('/:taskId', tasksController.updateTask, tasksController.updateTask)
router.delete('/:taskId', tasksController.removeTask)

module.exports = router;
