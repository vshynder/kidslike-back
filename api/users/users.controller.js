const Joi = require('joi');
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { ObjectId } = require('mongodb');
const UserModel = require('./users.model');
const defaultAvatar =
  'https://code-is-poetry.ru/wp-content/plugins/all-in-one-seo-pack-pro/images/default-user-image.png';

class AuthController {
  async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (user) {
        return res.status(409).send({ message: 'User is already exist' });
      }
      const hashPassword = await bcrypt.hash(password, 5);
      const createUser = await UserModel.create({
        username,
        email,
        password: hashPassword,
        avatarURL: defaultAvatar,
      });

      // дописать сессию, к ней подвязать айди пользователя, в токен вшить айди пользователя, в рефреш токен вшить айди сессии

      await AuthController.sendVerifyEmail(createUser);
      return res.send({
        user: {
          username,
          avatarURL: defaultAvatar,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async sendVerifyEmail(user) {
    try {
      const { id } = user._id;
      const verificationToken = await AuthController.saveVerifyToken(
        ObjectId(id),
      );

      const verificationURL = `${
        process.env.HEROKU_URI
          ? process.env.HEROKU_URI
          : 'http://localhost:1717/api/users/verify/'
      }${verificationToken}`;
      const msg = {
        to: user.email, // Change to your recipient
        from: process.env.MAIN_POST, // Change to your verified sender
        subject: 'Email Verification',
        text: 'Easy start with kidslike',
        html: `
                <h2>Hello ${user.username}</h2>
                <p>Welcome to Kidslike v2 service, we will help you instill good habits in your children</p>
                <br></br>
                <p>To start, you need to verify your account, that's not difficult, just click on this link ${verificationURL} and sign in to your account</P>
                `,
      };
      console.log(verificationURL);
      const result = await sgMail.send(msg);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  static async saveVerifyToken(userId) {
    const token = uuid();
    const { verificationToken } = await UserModel.findByIdAndUpdate(
      userId,
      {
        verificationToken: token,
      },
      { new: true },
    );

    return verificationToken;
  }

  validateCreateUser(req, res, next) {
    const validSchema = Joi.object({
      username: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    AuthController.checkValidateError(validSchema, req, res, next);
  }

  async verificationEmail(req, res, next) {
    try {
      const verifyToken = req.params.verificationToken;
      const userToVerify = await UserModel.findOne({
        verificationToken: verifyToken,
      });
      if (!userToVerify) {
        return res.send('User was not found');
      }
      await AuthController.verifyUser(userToVerify._id);
      return res.send({ message: 'User was verified' });
    } catch (err) {
      next(err);
    }
  }

  static async verifyUser(userId) {
    await UserModel.findByIdAndUpdate(userId, {
      status: 'verified',
      verificationToken: null,
    });
    return 'done';
  }

  static checkValidateError(schema, req, res, next) {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    next();
  }
}

module.exports = new AuthController();
