const TaskModel = require('./tasks.model')
const Joi = require('joi')


class TaskController {

    async addTask(req, res, next) {
        try {

            const millisecondsInADay = 86400000
            const { title, price, days } = req.body

            await TaskModel.create({
                title,
                price,
                timeToDo: Date.now() + millisecondsInADay * days
            })

            return res.status(201).send('Task created')

        } catch (error) {
            next(error)
        }

    }


    addTaskValidation(req, res, next) {
        const addSchemaValidator = Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required(),
            days: Joi.number(),
            time: Joi.date()
        })

        TaskController.checkValidationError(addSchemaValidator, req, res, next)
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