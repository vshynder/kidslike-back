const PresentsModel = require('./presents.model');
const ChildrenSchema = require('../children/children.model');
const {ChildrenModel} = require('../children/children.model');

class PresentsController {

async getAllPresentsChild(req,res){
try {
      //пока первый способ 
    // пока принимаем параметры id chilв где ищем совпадения childId в модели подарков в схеме 
    // нужно найти другой метот в поиске subdocument.populate  
    const {userId} = req.params
    console.log("userId =", userId);

    await ChildrenModel.find().populate('idUser').exec(function (err, children) {
      if (err) return handleError(err);
     const appPresent = children.map(present => present.presents)
      res.status(200).send(appPresent)
      //доделать 
    });

    // const childId = await PresentsModel.find({childId:userId})
    //отправляем client массив подарков   

} catch (error) {
  console.log(error);
} 
}

  async addPresent(req, res, next) {
    try {
      let image;
      const { title, childId, bal, file } = req.body;

      await ChildrenModel.findById(childId, async (err, child) => {
        req.body.name = child.name;

        child.presents.push(req.body);

        let childPresent = await child.save();

        let createdPresent =
          childPresent.presents[childPresent.presents.length - 1];
        res.status(200).send({
            title,
            childId,
            bal,
            image,
            dateCreated: Date.now(),
        });
      });

      // childrenModel.save(async function (err) {
      //   if (err) return handleError(err);
  

        // const present =  await PresentsModel.create({
        //   title,
        //   childId,
        //   bal,
        //   image,
        //   dateCreated: Date.now(),
        // });
      
      //   childrenModel.save(function (err) {
      //     if (err) return handleError(err);
      //     // that's it!
      //   });
      // });

      // await PresentsModel.create({
      //   title,
      //   childId,
      //   bal,
      //   image,
      //   dateCreated: Date.now(),
      // });

    } catch (err) {
      next(err);
    }
  }
  async removePresent(req, res, next) {
    try {
      const { presentId } = req.params;
      const result = await PresentsModel.findByIdAndDelete(presentId);
      if (!result) return res.status(404).send({ message: 'Not found' });
      return res.status(201).send('Present deleted');
    } catch (err) {
      next(err);
    }
  }
  async buyPresent(req, res, next) {
    // test
  }
}

module.exports = new PresentsController();
