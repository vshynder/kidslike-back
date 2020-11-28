const {PresentsModel} = require('./presents.model');
const {ChildrenModel} = require('../children/children.model');
const { ObjectId } = require('mongoose').Types;
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
      idUser:userId
    })
    
    if(!allChildrenByUser){
      return res.status(401).send({message:'Not found User ID'})
    };
    // собираем все idPresent со всех детей в массив
    const allPresents = allChildrenByUser.reduce((acc,present)=>{
      present.presents.length > 0 ? acc.push(...present.presents): false;
      return acc
        },[]);
    //находим всех pressent по id  
    const x = await PresentsModel.find({ _id: { $in: allPresents } })
  
    return res.status(201).send(x)
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
      const { childId,title, reward } = req.body;
    
      const splitpatch = req.files ? req.files.map(e => (e.path)) : ""
      const imagePath = splitpatch ? `http://localhost:1717/`+`${splitpatch}`.split('\\').slice(3).join('/') : "";
      const newPresent = await PresentsModel.create({
        title,
        childId,
        reward,
        image: imagePath,
        dateCreated: Date.now(),
      });
      await ChildrenModel.findById(childId,(err,child)=>{
        if(err)  {
          return res.status(404).send({message:'Not Found Child'})
        }
      child.presents.push(newPresent._id)
      child.save();
      res.status(200).send('Present added');
      })
    } catch (err) {
      next(err);
    }
  }
// надо переписать 
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
        const presentId = newPresent.map(e=>(e._id));
        await ChildrenModel.findByIdAndUpdate(childId, {$set: {presents: presentId}},{ upsert:true, returnNewDocument : true });
        return res.status(201).send("Present deleted"); 
      }
    } catch (err) {
      next(err);
    }
  }
  async updatePresent(req, res, next) {
    try {
      !req.session && res.status(404).send({ message: "Session was not found" });
      const {_id,title,reward,childId} = req.body
      const findIdPresent = await PresentsModel.findById(_id)
      !findIdPresent && res.status(404).send({ message: "Present was not found" });
      const updatePresent = await  PresentsModel.findByIdAndUpdate(_id, {
        title,
        childId,
        reward,
        image:'',
        dateCreated: Date.now(),
      });
      !updatePresent && res.status(404).send({ message: "Not found Id" });
        res.status(200).send({message:'Present was Update'})
    }catch(error){
      console.log(error)
      next(error)
    };
  };

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
      _id:Joi.string(),
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
