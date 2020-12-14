const queryString = require('query-string');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const userModel = require('../users/users.model');
const sessionModel = require('../session/session.model');
const bcrypt = require('bcrypt');
const defaultAvatar =
  'https://code-is-poetry.ru/wp-content/plugins/all-in-one-seo-pack-pro/images/default-user-image.png';
require('dotenv').config();

class GoogleOAuthController {
  //OpenId url
  formQueryString(req, res) {
    try {
      //отправляем на сервис гугл строку с запросом и параметрами
      //и получаем перенаправления на вход Сервиса Гугла в виде url
      const urlGoogle = this.googleGetCodeLogin();
      res.redirect(urlGoogle);
    } catch (error) {
      console.log(error);
    }
  }

  async loginFormGoogle(req, res, next) {
    try {
      //get code from Google Service
      // get token
      const token = await this.getAccessTokenFromCode(req.query.code);
      if (!token) {
        res.status(404).send({ message: 'Not found token' });
      }
      //get userProfile
      const user = await this.getGoogleDriveFiles(token);
      if (!user) {
        res.status(404).send({ message: 'Not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }

  googleGetCodeLogin() {
    const params = queryString.stringify({
      client_id:
        '85907041916-n8741e6h0gnv1ehv8f67anjrjk69qij6.apps.googleusercontent.com', //  Заглушка , тут будет id нашего серваси
      redirect_uri: `https://kidslike-back-end.herokuapp.com/api/auth/google/callback`, //  Заглушка url нашего сервиса на heruku /api/auth/google/callback
      // redirect_uri: `http://localhost:1717/api/auth/google/callback`,
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' '),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
    });
    const googleUrlReq = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    return googleUrlReq;
  }

  //  делаем запрос с параметрами  сервису Google на получения токена
  async getAccessTokenFromCode(code) {
    return await axios
      .post('https://oauth2.googleapis.com/token', {
        client_id:
          '85907041916-n8741e6h0gnv1ehv8f67anjrjk69qij6.apps.googleusercontent.com', //  Заглушка
        client_secret: 'I9CSPs3RUwOKVAG2OhAYEuYd', //  Заглушка
        redirect_uri: `https://kidslike-back-end.herokuapp.com/api/auth/google/callback`, //  Заглушка url нашего сервиса на heruku /api/auth/google/callback
        // redirect_uri: `http://localhost:1717/api/auth/google/callback`, //  Заглушка url нашего сервиса на heruku /api/auth/google/callback

        grant_type: 'authorization_code',
        code,
      })
      .then((data) => data.data.access_token)
      .catch((error) => console.log(error));
  }

  // вытаскиваем данные User с google сервиса который он нам прадоставляет
  async getGoogleDriveFiles(access_token) {
    return await axios
      .get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((data) => data.data)
      .catch((error) => console.log(error));
  }
}

class FacebookOAuthController {
  formQueryString(req, res, next) {
    try {
      console.log('go to facebook');
      const urlFacebook = this.facebookLoginUrl();
      res.redirect(urlFacebook);
    } catch (error) {
      console.log(error);
    }
  }

  async loginFormFacebook(req, res, next) {
    try {
      const code = req.query.code;
      const token = await this.getAccessTokenFromCodeFacebook(code);
      if (!token) {
        res.status(404).send({ message: 'Not found token' });
      }

      const user = await this.getFacebookUserData(token);
      if (!user) {
        res.status(404).send({ message: 'Not found' });
      }
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
    }
  }

  facebookLoginUrl() {
    const params = queryString.stringify({
      client_id: '367339414333042',
      redirect_uri: `https://kidslike-back-end.herokuapp.com/api/auth/facebook/callback`, //  //  Заглушка url нашего сервиса на heruku /api/auth/facebook/callback
      scope: ['email', 'user_friends'].join(','),
      response_type: 'code',
      auth_type: 'rerequest',
      display: 'popup',
    });

    const facebookUrl = `https://www.facebook.com/v9.0/dialog/oauth?${params}`;
    return facebookUrl;
  }
  async getAccessTokenFromCodeFacebook(code) {
    return await axios
      .post('https://graph.facebook.com/v9.0/oauth/access_token', {
        client_id: '367339414333042', //  Заглушка
        client_secret: '8a2156973ff3b46676ae7a9a4b49f4e3', //  Заглушка
        redirect_uri: `https://kidslike-back-end.herokuapp.com/api/auth/facebook/callback`, //  Заглушка
        code: code,
      })
      .then((data) => {
        return data.data.access_token;
      })
      .catch((error) => console.log(error));
  }

  async getFacebookUserData(accesstoken) {
    return await axios
      .get('https://graph.facebook.com/me', {
        params: {
          fields: ['id', 'email', 'name', 'last_name'].join(','),
          access_token: accesstoken,
        },
      })
      .then((data) => {
        return data.data;
      })
      .catch((error) => console.log(error));
  }
}

exports.initUser = async function initifacationUser(req, res) {
  try {
    const findUserEmail = await userModel.findOne({ email: req.user.email });

    const user =
      findUserEmail === null ? await newUser(req.user) : findUserEmail;

    const session = await sessionModel.create({
      sid: user.id || user._id,
    });

    const access_token = await jwt.sign(
      {
        uid: user.id || user._id,
        sid: session._id,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: '1h',
      },
    );
    const refreshToken = await jwt.sign(
      {
        uid: user.id || user._id,
        sid: session._id,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: '30d',
      },
    );
    return res
      .status(200)
      .redirect(
        `http://localhost:3000/login?token=${access_token}&refreshToken=${refreshToken}`,
      );
  } catch (error) {
    console.log(error);
  }
};

async function newUser(user) {
  const hashPassword = await bcrypt.hash('hashPassword', 5);

  const newUser = await userModel.create({
    status: 'verified',
    username: user.name,
    password: hashPassword,
    email: user.email,
    avatarURL: user.picture || defaultAvatar,
  });
  return newUser;
}

exports.googleOAuth = new GoogleOAuthController();
exports.facebookOAuth = new FacebookOAuthController();
