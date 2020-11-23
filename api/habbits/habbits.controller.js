const { HabbitsModel } = require('./habbits.model');
const Joi = require('joi');

const {
  Types: { ObjectId },
} = require('mongoose');

const { ChildrenModel, ChildrenSchema } = require('../children/children.model');

class Controllers {
  addHabbit = async (req, res, next) => {
    let { idChild } = req.body;
    idChild = '5fb7ac03930dc826c4b85a32'; // Заглушка, Id ребенка
    try {
      await ChildrenModel.findById(idChild, async (err, child) => {
        req.body.ownerHabbits = child.name;
        req.body.genderChild = child.gender;

        child.habbits.push(req.body);

        let childWithNewHabbit = await child.save();

        let createdHsabbit =
          childWithNewHabbit.habbits[childWithNewHabbit.habbits.length - 1];
        return res.status(200).send({
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

      return res.status(200).send(allHabbits);
    } catch (err) {
      next(err);
    }
  };

  updateHabbit = async (req, res, next) => {
    try {
      // let result = { complited: false, bonus: null };
      let {
        nameHabbit,
        priceHabbit,
        idHabbit,
        idNewChildOwnerHabbit,
      } = req.body; // Ожидается в req.body необязательные свойства nameHabbit, priceHabbit, idNewChildOwnerHabbit для обновления
      // idHabbit = '5fbac414128a4130c8bc9eae'; // Заглушка, Id Habbit, Ожидается в req.body.idHabbit.

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

      if (idNewChildOwnerHabbit) {
        let childForDelHabbit = await ChildrenModel.findOne({
          'habbits._id': idHabbit, // Можно искать по имени - 'habbits.name'
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

          await childForAddHabbit.save();
        } catch (err) {
          console.log(err);
          next(err);
        }
      }

      child.save();

      return res.status(200).send(getHabbit);
    } catch (err) {
      next(err);
    }
  };

  deleteHabbit = async (req, res, next) => {
    try {
      let { idHabbit } = req.body;
      idHabbit = '5fb6a804f81dbf1d40e8d3d9'; // Заглушка, Id Habbit, Ожидается в req.body.idHabbit.

      await ChildrenModel.findOne(
        {
          'habbits._id': idHabbit, // Можно искать по имени - 'habbits.name'
        },
        async (err, child) => {
          child.habbits = child.habbits.filter(
            (habbit) => habbit.id !== idHabbit,
          );
          child.save();
        },
      );

      return res.status(200).send('deleted');
    } catch (err) {
      next(err);
    }
  };

  checkHabbit = async (req, res, next) => {
    try {
      let result = { complited: false, bonus: null };
      let { confirmed, idHabbit } = req.body;
      idHabbit = '5fb52a395c98fb34189af5b9'; // Заглушка, Id Habbit, Ожидается в req.body.idHabbit.

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

          return res.status(200).send(result);
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
}

module.exports = new Controllers();
