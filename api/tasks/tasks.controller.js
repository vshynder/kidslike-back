const TaskModel = require('./tasks.model')
const Joi = require('joi')


class TaskController {

    async addTask(req, res, next) {
        try {

            const millisecondsInADay = 86400000
            const { title, price, days } = req.body
            const finishDay = days ? Date.now() + millisecondsInADay * days : null

            await TaskModel.create({
                title,
                price,
                days,
                startDay: Date.now(),
                finishDay
            })

            return res.status(201).send('Task created')

        } catch (error) {
            next(error)
        }

    }

    async updateTask(req, res, next) {

        const updatedTask = await TaskModel.findByIdAndUpdate(req.params.taskId, req.body)

        return updatedTask ?
            res.status(200).send({ message: "Task updated" }) :
            res.status(200).send({ message: "Not found" })

    }

    addTaskValidation(req, res, next) {
        const addSchemaValidator = Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required(),
            days: Joi.number(),
        })

        TaskController.checkValidationError(addSchemaValidator, req, res, next)
    }

    updateTaskValidation(req, res, next) {
        updateSchemaRules = Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required(),
            days: Joi.number()
        })

        TaskController.checkValidationError(updateSchemaRules, req, res, next)
    }

    static checkValidationError(schema, req, res, next) {
        const { error } = schema.validate(req.body)

        if (error) {
            const { message } = error.details[0]
            return res.status(400).send({ error: message })
        }

        next();
    }

}

module.exports = new TaskController()