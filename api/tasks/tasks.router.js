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
router.patch('/confirm/:taskId', tasksController.confirmTask);

router.delete('/:taskId', tasksController.removeTask);
router.patch('/notconfirm/:taskId', tasksController.notConfirmTask);

router.use('/', tasksController.getTasks);

module.exports = router;
