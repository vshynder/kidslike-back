const { Router } = require('express');
const tasksController = require('./tasks.controller');
const loginController = require('./../auth/login.controller');

const router = Router();

router.post(
  '/:childId',
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
router.patch(
  '/notconfirm/:taskId',
  loginController.authorize,
  tasksController.notConfirmTask,
);

router.use('/', tasksController.getTasks);

module.exports = router;
