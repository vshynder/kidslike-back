// const { HabbitsModel } = require('./habbits.model');
const { ChildrenModel } = require('../children/children.model');

class Controllers {
  // addHabbit = async (req, res, next) => {
  //   const idChild = '5fb3c07c3aa5d62efc2b9204'; // Заглушка, Id ребенка
  //   try {
  //     const habbitsAdd = await ChildrenModel.findById(
  //       idChild,
  //       async (err, child) => {
  //         req.body.ownerHabbits = child.name;
  //         child.habbits.push(req.body);
  //         let childWithNewHabbit = await child.save();

  //         let createdHsabbit =
  //           childWithNewHabbit.habbits[childWithNewHabbit.habbits.length - 1];
  //         res.status(200).send({
  //           idHabbit: createdHsabbit._id,
  //           nameHabbit: createdHsabbit.nameHabbit,
  //           priceHabbit: createdHsabbit.priceHabbit,
  //           ownerHabbits: createdHsabbit.ownerHabbits,
  //         });
  //       },
  //     );
  //   } catch (err) {
  //     console.log(err);
  //     next(err);
  //   }
  // };
  // getHabbit = async (req, res, next) => {
  //   try {
  //     const idHabbit = '5fb3cb087e07701f0c728009'; // Заглушка, Id Habbit
  //     console.log(HabbitsModel);
  //     let childrenWithIdHabbit = await ChildrenModel.findOne({
  //       'habbits._id': idHabbit, // Можно искать по имени - 'habbits.name'
  //     });

  //     const getHabbit = childrenWithIdHabbit.habbits.find(
  //       (habbit) => habbit.id === idHabbit,
  //     );

  //     res.status(200).send({
  //       nameHabbit: getHabbit.nameHabbit,
  //       id: getHabbit._id,
  //       priceHabbit: getHabbit.priceHabbit,
  //       sprintHabbit: getHabbit.sprintHabbit,
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // };

  getAllHabbitsChildrenByUser = async (req, res, next) => {
    try {
      // console.log(1, req.body);
      req.user = { id: '5fb313842e5c6c182c9b214f' }; //Заглушка, ожидает обьект req.user с полем id Родителя ???
      req.body.idUser = req.user.id;

      const allChildrenByUser = await ChildrenModel.find({
        idUser: req.body.idUser,
      });

      const allHabbits = allChildrenByUser.reduce((acc, ell) => {
        ell.habbits.length > 0 && acc.push(...ell.habbits);
        return acc;
      }, []);

      console.log(allHabbits);
      res.status(200).send(allHabbits);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new Controllers();
