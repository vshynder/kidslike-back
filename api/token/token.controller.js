const authUserModel = require('../auth/auth.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class TokenController {
  async refreshToken(req, res) {
    try {

      const authHeader = req.get('Authorization');
      let token;

      token = !authHeader ? res.status(401,'Unauthorized').send({ message: 'Not authorized' }) : authHeader.split(' ')[1];
        let user;
      
        try {
         await jwt.verify(token, process.env.SECRET_TOKEN).id;
      } catch (error) {
        return res
          .status(401, 'Unauthorized')
          .send({ message: 'Not authorized' });
      }

      user = await authUserModel.findOne({ refresh_token: token });

      if (!user) {
        return res.status(401).send({ message: 'Not Found User' });
      }

      const new_token = await jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        process.env.SECRET_TOKEN,
        {
          expiresIn: '1h',
        },
      );

      const new_refresh_token = await jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.SECRET_TOKEN,
        {
          expiresIn: '24h',
        },
      );

      await authUserModel.findByIdAndUpdate(
        user.id,
        { token: new_token, refresh_token: new_refresh_token },
        { new: true },
      );

      return res.status(201).json({
        access_token: new_token,
        refresh_token: new_refresh_token,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new TokenController();