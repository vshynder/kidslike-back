const {PresentsModel} = require('./presents.model');
const userModel = require('../users/users.model')
const ChildrenSchema = require('../children/children.model');
const {ChildrenModel} = require('../children/children.model');
const { Types, SchemaType } = require('mongoose');
const { ObjectId } = require('mongoose').Types;
// const { types } = require('joi');
const Joi = require('joi');

class PresentsController {

async getAllPresentsChild(req,res){
try {
    const session = req.session;
      if (!session) {
        return res.status(404).send({ message: "Session was not found" });
      }

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
      const session = req.session;
      if (!session) {
        return res.status(404).send({ message: "Session was not found" });
      }
      req.child = { id: '5fbe5d5d25fad0371495570f' }; //Заглушка, очікування обьекта req.child з id
      req.body.childId = req.child.id;
      let { childId } = req.body;
      const findsId = (id) => {return ChildrenModel.find({_id:id})};
      if(!findsId(childId))return res.status(404).send({ message: 'Not found' });
      const splitpatch = req.files ? req.files.map(e => (e.path)) : ""
      const imagePath = splitpatch ? `http://localhost:1717/`+`${splitpatch}`.split('\\').slice(3).join('/') : "";
      const { title, reward} = req.body;
      await PresentsModel.create({
        title,
        childId,
        reward,
        image: imagePath,
        dateCreated: Date.now(),
      })
      const newPresent = await PresentsModel.find();
      const presentId = newPresent.map(e=>(e._id));
      await ChildrenModel.findByIdAndUpdate(childId, {$set: {presents: presentId}},{ upsert:true, returnNewDocument : true });
      res.status(200).send('Present added');
    } catch (err) {
      next(err);
    }
  }

  async removePresent(req, res, next) {
    try {
      const session = req.session;
      if (!session) {
        return res.status(404).send({ message: "Session was not found" });
      }
      const { presentId } = req.params;
      req.child = { id: '5fbe5d5d25fad0371495570f'}; //Заглушка, очікування обьекта req.child з id
      req.body.childId = req.child.id;
      let { childId } = req.body;
      if (ObjectId.isValid(presentId)) {
        console.log(presentId)
        const result = await PresentsModel.findByIdAndDelete(presentId);
        if (!result) return res.status(404).send({ message: 'Not found' });
        const newPresent = await PresentsModel.find();
        const newPresentId = newPresent.map(e=>(e._id));
        await ChildrenModel.findByIdAndUpdate(childId, {$set: {presents: newPresentId}},{ upsert:true, returnNewDocument : true });
        return res.status(201).send("Present deleted"); 
      }
    } catch (err) {
      next(err);
    }
  }
  async buyPresent(req, res, next) {
    try {
      const session = req.session;
      if (!session) {
        return res.status(404).send({ message: "Session was not found" });
      }
      const { presentId } = req.params;
      req.child = { id: '5fbe5d5d25fad0371495570f'}; //Заглушка, очікування обьекта req.child з id
      req.body.childId = req.child.id;
      let { childId } = req.body;

      if (ObjectId.isValid(presentId)) {
        const Present = await PresentsModel.findById(presentId);
        const Child = await ChildrenModel.findById(childId);
        const rewardChild = Child.stars;
        const rewardPresent = Present.reward;
        if(rewardChild >= rewardPresent){
          const newRewardPresent = rewardChild - rewardPresent;
          await ChildrenModel.findByIdAndUpdate(childId, {$set: {stars: newRewardPresent}},{ upsert:true, returnNewDocument : true });
          return res.status(200).send('Present buy'); 
          // const result = await PresentsModel.findByIdAndDelete(presentId);
          // if (!result) return res.status(404).send({ message: 'Not found' });
        } else {res.status(404).send({ message: "You don't have that much stars" })}
        // const newPresent = await PresentsModel.find();
        // const newPresentId = newPresent.map(e=>(e._id));
      }
    } catch (err) {
      next(err);
    }
  }


  validPresent = (req, res, next) => {
    const validator = Joi.object({
      title: Joi.string(),
      childId: Joi.string().required(),
      reward: Joi.number(),
      image: Joi.string(),
      dateCreated: Joi.date(),
    });
    const { error } = validator.validate(req.body);
    return error ? res.status(400).send(error.message) : next();
  };
}

module.exports = new PresentsController();
