const PresentsModel = require('./presents.model');

class PresentsController {
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
  //   async buyPresent(req, res, next) {
  //     // test
  //   }
}

module.exports = new PresentsController();
