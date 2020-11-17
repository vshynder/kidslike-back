const { Router } = require('express');
const tasksController = require('./tasks.controller');

const router = Router();

// router.use('/', tasksController.getTasks);

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
router.patch('/confirm/:taskId', tasksController.confirmTask);
router.delete('/:taskId', tasksController.removeTask);

module.exports = router;
