const { ChildrenModel } = require('./children.model');
const UserModel = require('../users/users.model');
const Joi = require('joi');

class Controllers {
  async getAllChildrensCurrentUser(req, res, next) {
     try {
       req.user.populate('childrens').execPopulate((error, child) => {
         return res.send(
           child.childrens
          )
        })
     }catch(err) {
       next(err)
     }
  }
  addChild = async (req, res, next) => {
    try {
      req.body.idUser = req.user._id;
      const child = await ChildrenModel.create(req.body);
      let user = await UserModel.findById(req.body.idUser);
      if (!user) {
        res.status(400).send('No user');
      }
      user.childrens.push(child.id);
      user.save();

      return res.status(201).send({
        id: child._id,
        name: child.name,
        gender: child.gender,
        stars: child.stars,
        habbits: child.habbits,
        tasks: child.tasks,
        presents: child.presents,
        idUser: child.idUser,
      });
    } catch (err) {
      next(err.message);
    }
  };

  validChild = (req, res, next) => {
    const validator = Joi.object({
      name: Joi.string().empty().max(30).required(),
      gender: Joi.string().empty().required(),
    });
    const { error } = validator.validate(req.body);
    return error
      ? res.status(400).send({ message: error.details[0].message })
      : next();
  };
}

module.exports = new Controllers();
