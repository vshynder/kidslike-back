const queryString = require("query-string");
const axios = require("axios");
require("dotenv").config();


class GoogleOAuthController {
  //OpenId url
    constructor(){
        this.service_id = '85907041916-n8741e6h0gnv1ehv8f67anjrjk69qij6.apps.googleusercontent.com',
        this.service_secret_code = 'I9CSPs3RUwOKVAG2OhAYEuYd'
    }
  formQueryString(req, res){
        try {
            //отправляем на сервис гугл строку с запросом и параметрами 
            //и получаем перенаправления на вход Сервиса Гугла в виде url
          const urlGoogle = googleGetCodeLogin();
          res.redirect(urlGoogle);
        } catch (error) {
            console.log(error);
        }  
  };
  async  loginFormGoogle(req, res, next) {
    try {
        //get code fron Google Service 
      const code = req.query.code;
      // get token
      const token = await getAccessTokenFromCode(code);
      if(!token){
          res.status(404).send({message:'Not found token'})
      }
      //get userProfile
      const user = await getGoogleDriveFiles(token);
      if(!user){
          res.status(404).send({message:'Not found'})
      };
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };

  async initifacationUser(){
    try {
        if (!req.user) {
          return res.status(404).send({ message: "Not Found User" });
        }
    
        let user = req.user
    
        const findUserEmail = await authModel.findOne({ email: user.email });
    
        if (findUserEmail === null) {
          const userNewUser = await authModel.create({
            name: user.name,
            email: user.email,
            password:'123445',
            subscription: "free",
          });
        return user = userNewUser;
        }
        // доделать сессию
        // const getSession = await authModel.findOne({session})
        // if(!getSession){
        //     getSession = await authSession.create({
        //         id:uuid4();
        //     }) 
        // }
        const access_token = await jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.SECRET_TOKEN,
          {
            expiresIn: "1h",
          }
        );
    
        const refresh_token = await jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.SECRET_TOKEN,
          {
            expiresIn: "24h",
          }
        );
    
        user.id = findUserEmail._id  
        const updateUserToken = await authModel.findByIdAndUpdate(
            user.id ,
          { 
              //доделать сессию
              session
           },
          { new: true }
        );
    
        return res.status(201).send({
            access_token,refresh_token,session
        })
      } catch (error) {
        console.log();(error);
      }
  }

  googleGetCodeLogin() {
    const params = queryString.stringify({
      client_id: this.service_id,
      redirect_uri: "http://localhost:3002/auth/google/main",
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ].join(" "),
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
    });
    const googleUrlReq = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    return googleUrlReq;
  }

  //  делаем запрос с параметрами  сервису Google на получения токена
  async  getAccessTokenFromCode(code) {
    return await axios.post('https://oauth2.googleapis.com/token',{ 
      client_id: this.service_id,
      client_secret: this.service_secret_code,
      redirect_uri: "http://localhost:3002/auth/google/main",
      grant_type: "authorization_code",
      code,})
          .then(data => data.data.access_token)
          .catch(error => console.log(error))
  }

// вытаскиваем данные User с google сервиса который он нам прадоставляет 
  async  getGoogleDriveFiles(access_token) {
    return await axios.get('https://www.googleapis.com/oauth2/v2/userinfo',{
      headers:{
        Authorization: `Bearer ${access_token}`,
      }
    })
    .then(data => data.data)
    .catch(error => console.log(error));
  }
}

module.exports = new GoogleOAuthController();