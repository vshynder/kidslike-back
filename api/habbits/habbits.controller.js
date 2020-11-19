const { HabbitsModel } = require('./habbits.model');
const Joi = require('joi');

const {
  Types: { ObjectId },
} = require('mongoose');

const { ChildrenModel, ChildrenSchema } = require('../children/children.model');

class Controllers {
  addHabbit = async (req, res, next) => {
    let { idChild } = req.body;
    idChild = '5fb4f73805dba90ca4fbf464'; // Заглушка, Id ребенка
    try {
      await ChildrenModel.findById(idChild, async (err, child) => {
        req.body.ownerHabbits = child.name;

        child.habbits.push(req.body);

        let childWithNewHabbit = await child.save();

        let createdHsabbit =
          childWithNewHabbit.habbits[childWithNewHabbit.habbits.length - 1];
        res.status(200).send({
          idHabbit: createdHsabbit._id,
          nameHabbit: createdHsabbit.nameHabbit,
          priceHabbit: createdHsabbit.priceHabbit,
          ownerHabbits: createdHsabbit.ownerHabbits,
        });
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

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

  async confirmedHabit(req, res, next) {
    try {
      const { id } = req.params;
      console.log(id);
      const confirmed = await HabbitsModel.findByIdAndUpdate(id, {
        isDone: 'confirmed',
      });
      console.log(confirmed);
      console.log(req.params);
      return confirmed
        ? res.status(200).send({ message: 'Confirmed' })
        : res.status(404).send({ message: 'Not found' });
    } catch (error) {
      next(error);
    }
  }

  async unconfirmed(req, res, next) {
    try {
      const { id } = req.params;
      const confirmed = await HabbitsModel.findByIdAndUpdate(id, {
        isDone: 'unConfirmed',
      });
      return confirmed
        ? res.status(200).send({ message: 'unconfirmed' })
        : res.status(404).send({ message: 'Not found' });
    } catch (error) {
      next(error);
    }
  }

  validIdChild = (req, res, next) =>
    !ObjectId.isValid(req.body.idChild)
      ? res.status(400).send('Invalid id!')
      : next();
}

module.exports = new Controllers();
