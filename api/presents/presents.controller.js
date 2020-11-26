const {PresentsModel} = require('./presents.model');
const userModel = require('../users/users.model')
const ChildrenSchema = require('../children/children.model');
const {ChildrenModel} = require('../children/children.model');
const { Types, SchemaType } = require('mongoose');
const { types } = require('joi');
const multer = require('multer');

class PresentsController {

async getAllPresentsChild(req,res){
try {

    const {userId} = req.params  // принимает в строке запроса _id User
    console.log("userId =", userId);

    const allChildrenByUser = await ChildrenModel.find({
      idUser:Types.ObjectId(userId)
    })

    if(!allChildrenByUser){
      return res.status(401).send({message:'Not found User ID'})
    }
  
    const allPresents = allChildrenByUser.reduce((acc,present)=>{
      
      present.presents.length > 0 ? acc.push(...present.presents): false;
      console.log(acc);
      return acc
        },[]);
        
    //to do find all pseresents id to array 
    return res.status(201).send(allPresents)
} catch (error) {
  console.log(error);
} 
}

  async addPresent(req, res, next) {
    try {
      req.child = { id: '5fbe5d5d25fad0371495570f' }; //Заглушка, очікування обьекта req.child з id
      req.body.childId = req.child.id;
      let { childId } = req.body;
      const splitpatch = req.files ? req.files.map(e => (e.path)) : ""
      const imagePath = splitpatch ? `http://localhost:1717/`+`${splitpatch}`.split('\\').slice().join('/') : "";
      const { title, bal} = req.body;

      await ChildrenModel.findById(childId, async (err, child) => {

        const newPresent = await PresentsModel.create({
          title,
          childId,
          bal,
          image: imagePath,
          dateCreated: Date.now(),
        })
        
        child.presents.push(newPresent);

        await child.save();
        res.status(200).send('Present added');
      });

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

  validPresent = (req, res, next) => {
    const validator = Joi.object({
      title: Joi.string().required(),
      childId: Joi.string().required(),
      bal: Joi.number().required(),
      image: Joi.string(),
      dateCreated: Joi.date(),
    });
    const { error } = validator.validate(req.body);
    return error ? res.status(400).send(error.message) : next();
  };
}

module.exports = new PresentsController();
