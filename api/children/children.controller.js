const { ChildrenModel } = require('./children.model');
const Joi = require('joi');

class Controllers {
  addChild = async (req, res, next) => {
    try {
      const isExisted = await ChildrenModel.findOne({ name: req.body.name });
      if (isExisted) {
        return res.status(409).send(`Child with this name exists`);
      }
      console.log(req.body);
      req.user = { id: '5fb313842e5c6c182c9b214f' }; //Заглушка, ожидает обьект req.user с полем id Родителя ???
      req.body.idUser = req.user.id;
      const child = await ChildrenModel.create(req.body);
      return res
        .status(201)
        .send({ id: child._id, name: child.name, gender: child.gender });
    } catch (err) {
      res.status(400);
      next(err.message);
    }
  };

  validChild = (req, res, next) => {
    const validator = Joi.object({
      name: Joi.string().required(),
      gender: Joi.string().required(),
    });
    const { error } = validator.validate(req.body);
    return error ? res.status(400).send(error.message) : next();
  };
}

module.exports = new Controllers();
