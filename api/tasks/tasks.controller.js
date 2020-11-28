const TaskModel = require('./tasks.model');
const { ChildrenModel } = require('../children/children.model');
const Joi = require('joi');

class TaskController {
  async getTasks(req, res, next) {
    try {
      const tasks = await TaskModel.find();
      return res.status(200).send(tasks);
    } catch (error) {
      next(error);
    }
  }

  async addTask(req, res, next) {
    try {
      const { childId } = req.params;
      const { title, reward, daysToDo } = req.body;

      const millisecondsInADay = 86400000;
      const finishDay = daysToDo
        ? Date.now() + millisecondsInADay * daysToDo
        : null;

      const task = await TaskModel.create({
        title,
        reward,
        daysToDo,
        startDay: Date.now(),
        finishDay,
        childId,
      });

      await ChildrenModel.findById(childId, async (err, children) => {
        await children.tasks.push(task.id);
        await children.save();
      });

      return res.status(201).send(task);
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req, res, next) {
    try {
      const { daysToDo } = req.body;
      const millisecondsInADay = 86400000;
      const finishDay = daysToDo
        ? Date.now() + millisecondsInADay * daysToDo
        : null;

      const updated = daysToDo
        ? { startDay: Date.now(), finishDay }
        : { startDay: null, finishDay: null, ...req.body };

      const updatedTask = await TaskModel.findByIdAndUpdate(
        req.params.taskId,
        updated,
      );

      return updatedTask
        ? res.status(200).send({ message: 'Task updated' })
        : res.status(200).send({ message: 'Not found' });
    } catch (error) {
      next(error);
    }
  }
  async repeatTask(req, res, next) {
    try {
      const millisecondsInADay = 86400000;
      const { taskId } = req.params;
      const task = await TaskModel.findById(taskId);

      const finishDay = task.daysToDo
        ? Date.now() + millisecondsInADay * task.daysToDo
        : null;

      const repeatTask = await TaskModel.findByIdAndUpdate(taskId, {
        isCompleted: 'active',
        startDay: Date.now(),
        finishDay,
      });
      return repeatTask
        ? res.status(200).send({ message: 'Task active' })
        : res.status(404).send({ message: 'Not found' });
    } catch (error) {
      next(error);
    }
  }

  async confirmTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const confirmedTask = await TaskModel.findByIdAndUpdate(taskId, {
        isCompleted: 'done',
      });
      console.log(confirmedTask);
      return confirmedTask
        ? res.status(200).send({ message: 'Task confirmed' })
        : res.status(200).send({ message: 'Not found' });
    } catch (error) {
      next(error);
    }
  }

  async notConfirmTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const confirmedTask = await TaskModel.findByIdAndUpdate(taskId, {
        isCompleted: 'undone',
      });
      return confirmedTask
        ? res.status(200).send({ message: 'Task not confirmed' })
        : res.status(404).send({ message: 'Not found' });
    } catch (error) {
      next(error);
    }
  }
  async removeTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const task = await TaskModel.findById(taskId);
      if (!task) {
        return res.status(404).send({ message: 'Not found' });
      }

      await ChildrenModel.findByIdAndUpdate(
        task.childId,
        { $pull: { tasks: taskId } },
        { new: true },
      );

      await TaskModel.findByIdAndDelete(taskId);

      return res.status(200).send({ message: 'Task deleted' });
    } catch (error) {
      next(error);
    }
  }

  addTaskValidation(req, res, next) {
    const addSchemaValidator = Joi.object({
      title: Joi.string().required(),
      reward: Joi.number().required(),
      daysToDo: Joi.number(),
    });

    TaskController.checkValidationError(addSchemaValidator, req, res, next);
  }

  updateTaskValidation(req, res, next) {
    const updateSchemaRules = Joi.object({
      title: Joi.string(),
      reward: Joi.number(),
      daysToDo: Joi.number(),
    });

    TaskController.checkValidationError(updateSchemaRules, req, res, next);
  }

  static checkValidationError(schema, req, res, next) {
    const { error } = schema.validate(req.body);

    if (error) {
      const { message } = error.details[0];
      return res.status(400).send({ error: message });
    }

    next();
  }
}

module.exports = new TaskController();
