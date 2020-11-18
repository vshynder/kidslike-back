const PresentsModel = require('./presents.model');
class PresentsController {

async getAllPresentsChild(req,res){
try {
      //пока первый способ 
    // пока принимаем параметры id chilв где ищем совпадения childId в модели подарков в схеме 
    // нужно найти другой метот в поиске subdocument.populate  
    const userId = req.params.childId

    const childId = await PresentsModel.find({childId:userId})
    //отправляем client массив подарков   
    res.status(200).send(childId)
} catch (error) {
  console.log(error);
} 
}

  async addPresent(req, res, next) {
    try {
      let image;
      const { title, childId, bal, file } = req.body;
      await PresentsModel.create({
        title,
        childId,
        bal,
        image,
        dateCreated: Date.now(),
      });
      return res.status(201).send('Present added');
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
