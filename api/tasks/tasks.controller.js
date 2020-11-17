const TaskModel = require('./tasks.model');
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
      const millisecondsInADay = 86400000;
      const { title, reward, daysToDo } = req.body;
      const finishDay = daysToDo
        ? Date.now() + millisecondsInADay * daysToDo
        : null;

      await TaskModel.create({
        title,
        reward,
        daysToDo,
        startDay: Date.now(),
        finishDay,
        //пока в БД нет объекта ребенка, значение будет null
        childId: null,
      });

      return res.status(201).send('Task created');
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
  async removeTask(req, res, next) {
    try {
      const contact = await TaskModel.findByIdAndDelete(req.params.taskId);

      if (!contact) {
        return res.status(404).send({ message: 'Not found' });
      }
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
      title: Joi.string().required(),
      reward: Joi.number().required(),
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
