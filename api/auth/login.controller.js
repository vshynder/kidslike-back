const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const SessionModel = require('../session/session.model');
const UserModel = require('../users/users.model.js');

class LoginController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).send({ message: 'User was not found' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.send({ message: 'Authentefication failed.' });
      }

      if (user.status != 'verified') {
        return res.send({ message: 'User was not verified' });
      }
      const parseId = ObjectId(user._id);
      const session = await SessionModel.findOne({ sid: parseId });
      if (session) {
        return res.send({ message: 'Session is already created' });
      }
      const createSession = await SessionModel.create({
        sid: parseId,
      });
      const accessToken = await jwt.sign(
        { id: createSession.sid },
        process.env.TOKEN_SECRET ? process.env.TOKEN_SECRET : 'kidslike',
        { expiresIn: '1h' },
      );
      const refreshToken = await jwt.sign(
        { id: createSession._id },
        process.env.TOKEN_SECRET ? process.env.TOKEN_SECRET : 'kidslike',
        { expiresIn: '30d' },
      );
      return res.send({
        user: {
          username: user.username,
          avatarURL: user.avatarURL,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get('Authorization') || '';
      let token;
      if (authorizationHeader) {
        token = authorizationHeader.split(' ')[1];
      }
      const decoded = await jwt.decode(token);
      if (decoded === null || !decoded) {
        res.status(400).send({ message: 'Invalid token' });
      }
      try {
        const session = await SessionModel.findOne({ sid: decoded.id });
        if (!session) {
          return res.status(400).send({ message: 'User was not authorize' });
        }
        //Здесь еще не хватает логики с рефреш токеном, как быть если обычный токен истек
        req.session = session;
      } catch (err) {
        next(err);
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      await SessionModel.findByIdAndDelete(req.session._id);
      return res.send({ message: 'deleted' });
    } catch (err) {
      next(err);
    }
  }

  validateUserLogin(req, res, next) {
    const validateSchema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    LoginController.checkValidationError(validateSchema, req, res, next);
  }

  static checkValidationError(schema, req, res, next) {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    next();
  }
}

module.exports = new LoginController();
