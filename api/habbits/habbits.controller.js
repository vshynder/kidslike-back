const { HabbitsModel } = require('./habbits.model');
const Joi = require('joi');

const {
  Types: { ObjectId },
} = require('mongoose');

const { ChildrenModel, ChildrenSchema } = require('../children/children.model');

class Controllers {
  getAllHabbitsChildrenByUser = async (req, res, next) => {
    try {
      req.user = { id: '5fb313842e5c6c182c9b214f' }; //Заглушка, ожидает обьект req.user с полем id Родителя ???
      req.body.idUser = req.user.id;

      const allChildrenByUser = await ChildrenModel.find({
        idUser: req.body.idUser,
      });

      const allHabbits = allChildrenByUser.reduce((acc, ell) => {
        ell.habbits.length > 0 && acc.push(...ell.habbits);
        return acc;
      }, []);

      res.status(200).send(allHabbits);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new Controllers();
