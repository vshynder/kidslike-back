const PresentsModel = require('./presents.model');
const userModel = require('../users/users.model')
const ChildrenSchema = require('../children/children.model');
const {ChildrenModel} = require('../children/children.model');
const { Types, SchemaType } = require('mongoose');
const { types } = require('joi');

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
      let image;
      const { title, childId, bal, file } = req.body;

      await ChildrenModel.findById(childId, async (err, child) => {

        const newPresent = await PresentsModel.create({
          title,
          childId,
          bal,
          image,
          dateCreated: Date.now(),
        })
        
        child.presents.push(newPresent);

        let childPresent = await child.save();
        res.status(200).send(childPresent);
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
}

module.exports = new PresentsController();
