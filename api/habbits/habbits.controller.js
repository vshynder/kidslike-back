const { HabbitsModel } = require('./habbits.model');
const Joi = require('joi');

const {
  Types: { ObjectId },
} = require('mongoose');

const { ChildrenModel } = require('../children/children.model');
// const { send } = require('@sendgrid/mail');

class Controllers {
  addHabbit = async (req, res, next) => {
    let { idChild } = req.body;
    try {
      await ChildrenModel.findById(idChild, async (err, child) => {
        req.body.ownerHabbits = child.name;
        req.body.genderChild = child.gender;

        child.habbits.push(req.body);

        let childWithNewHabbit = await child.save();

        let createdHabbit =
          childWithNewHabbit.habbits[childWithNewHabbit.habbits.length - 1];

        return res.status(201).send(createdHabbit);
      });
    } catch (err) {
      next(err);
    }
  };

  getAllHabbitsChildrenByUser = async (req, res, next) => {
    try {
      // req.user = { _id: '5fb313842e5c6c182c9b214f' }; //Заглушка, ожидает обьект req.user с полем id Родителя ???

      req.body.idUser = req.user._id;

      const allChildrenByUser = await ChildrenModel.find({
        idUser: req.body.idUser,
      });

      const allHabbits = allChildrenByUser.reduce((acc, ell) => {
        ell.habbits.length > 0 && acc.push(...ell.habbits);
        return acc;
      }, []);

      return res.status(200).send(allHabbits);
    } catch (err) {
      next(err);
    }
  };

  updateHabbit = async (req, res, next) => {
    try {
      let {
        nameHabbit,
        priceHabbit,
        idHabbit,
        idNewChildOwnerHabbit,
      } = req.body; // Ожидается в req.body необязательные свойства nameHabbit, priceHabbit, idNewChildOwnerHabbit для обновления
      //idHabbit, Ожидается в req.body.idHabbit обязательный параметр.

      let child = await ChildrenModel.findOne({
        'habbits._id': idHabbit,
      });

      !child && res.status(400).send('no IdHabbit ' + idHabbit);

      const getHabbit = child.habbits.find((habbit) => habbit.id === idHabbit);

      if (nameHabbit) {
        getHabbit.nameHabbit = nameHabbit;
      } else {
        req.body.nameHabbit = getHabbit.nameHabbit;
      }

      if (priceHabbit) {
        getHabbit.priceHabbit = priceHabbit;
      } else {
        req.body.priceHabbit = getHabbit.priceHabbit;
      }

      let responseHabbit = getHabbit;

      if (idNewChildOwnerHabbit) {
        let childForDelHabbit = await ChildrenModel.findOne({
          'habbits._id': idHabbit,
        });

        childForDelHabbit.habbits = childForDelHabbit.habbits.filter(
          (habbit) => habbit.id !== idHabbit,
        );
        childForDelHabbit.save();

        try {
          let childForAddHabbit = await ChildrenModel.findById(
            idNewChildOwnerHabbit,
          );

          req.body.idChild = idNewChildOwnerHabbit;
          req.body.ownerHabbits = childForAddHabbit.name;
          req.body.genderChild = childForAddHabbit.gender;

          childForAddHabbit.habbits.push(req.body);

          let allHabbits = await childForAddHabbit.save();

          responseHabbit = allHabbits.habbits[allHabbits.habbits.length - 1];
        } catch (err) {
          next(err);
        }
      }

      child.save();

      return res.status(202).send(responseHabbit);
    } catch (err) {
      next(err);
    }
  };

  deleteHabbit = async (req, res, next) => {
    try {
      let idHabbit = req.params.idHabbit;

      let child = await ChildrenModel.findOne({
        'habbits._id': idHabbit,
      });

      if (!child) {
        return res.status(400).send('No Habbit');
      }

      child.habbits = child.habbits.filter((habbit) => habbit.id !== idHabbit);
      child.save();

      return res.status(200).send('deleted');
    } catch (err) {
      next(err);
    }
  };

  checkHabbit = async (req, res, next) => {
    try {
      let result = { complited: false, bonus: null };
      let { confirmed, idHabbit } = req.body;

      await ChildrenModel.findOne(
        {
          'habbits._id': idHabbit,
        },
        async (err, child) => {
          const getHabbit = child.habbits.find(
            (habbit) => habbit.id === idHabbit,
          );

          let arr = getHabbit.sprintHabbit.split('');

          for (let i = 0; i < arr.length; i += 1) {
            if (arr[i] === '1' && confirmed === true) {
              arr[i] = '+';

              child.stars = getHabbit.priceHabbit + child.stars;

              if (i + 1 === arr.length && arr.includes('-')) {
                result = { complited: true, bonus: false };
              }
              if (i + 1 === arr.length && !arr.includes('-')) {
                result = { complited: true, bonus: true };

                child.stars = child.stars + getHabbit.priceHabbit * 10 * 0.5;
              }

              break;
            }

            if (arr[i] === '1' && confirmed === false) {
              arr[i] = '-';

              if (i + 1 === arr.length && arr.includes('-')) {
                result = { complited: true, bonus: false };
              }

              break;
            }
          }

          getHabbit.sprintHabbit = arr.join('');

          child.save();

          return res
            .status(200)
            .send({ ...result, newSprintHabbit: getHabbit.sprintHabbit });
        },
      );
    } catch (err) {
      next(err);
    }
  };

  validIdHabbit = (req, res, next) =>
    !ObjectId.isValid(req.body.idHabbit)
      ? res.status(400).send('Invalid id!')
      : next();

  validIdChild = (req, res, next) =>
    !ObjectId.isValid(req.body.idChild)
      ? res.status(400).send('Invalid id!')
      : next();

  validAddHabit = (req, res, next) => {
    const validator = Joi.object({
      nameHabbit: Joi.string().empty().max(50).required(),
      priceHabbit: Joi.number().empty().required(),
      idChild: Joi.string().required(),
    });
    const { error } = validator.validate(req.body);
    return error
      ? res.status(400).send({ message: error.details[0].message })
      : next();
  };

  validUpdateHabbit = (req, res, next) => {
    const validator = Joi.object({
      nameHabbit: Joi.string().max(50),
      priceHabbit: Joi.number(),
      idHabbit: Joi.string().required(),
      idNewChildOwnerHabbit: Joi.string(),
    });

    const { error } = validator.validate(req.body);
    return error
      ? res.status(400).send({ message: error.details[0].message })
      : next();
  };

  validCheckHabbit = (req, res, next) => {
    const validator = Joi.object({
      confirmed: Joi.boolean().required(),
      idHabbit: Joi.string().required(),
    });

    const { error } = validator.validate(req.body);
    return error
      ? res.status(400).send({ message: error.details[0].message })
      : next();
  };

  validDeleteHabbit = (req, res, next) =>
    !ObjectId.isValid(req.params.idHabbit)
      ? res.status(400).send('Invalid id!')
      : next();
}

module.exports = new Controllers();
