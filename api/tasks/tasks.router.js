const { Router } = require('express');
const tasksController = require('./tasks.controller');

const router = Router();

router.post(
  '/addTask',
  tasksController.addTaskValidation,
  tasksController.addTask,
);
router.patch(
  '/:taskId',
  tasksController.updateTaskValidation,
  tasksController.updateTask,
);
router.patch('/repeat/:taskId', tasksController.repeatTask);
router.delete('/:taskId', tasksController.removeTask);

router.use('/', tasksController.getTasks);

module.exports = router;
