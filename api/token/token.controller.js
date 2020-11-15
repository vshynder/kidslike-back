const authUserModel = require('../auth/auth.model');
const jwt = require('jsonwebtoken');


class TokenController{
   
    async  verifyRefreshToken(req,res){
        try {
            
            const user = await authUserModel.findOne({ refresh_token:req.params.token });

            if(!user.refresh_token || user.refresh_token===null){
                return res.status(401).send({message:'Not Found Token'})
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

            const new_refresh_token = await jwt.sign({
                id:user.id,
                email:user.email
            },
            process.env.SECRET_TOKEN,
            {
                expiresIn:'24h',
            }
            );
            
            await authUserModel.findByIdAndUpdate(user.id,{token:new_token,refresh_token:new_refresh_token},{new:true});

            return res
            .status(201)
            .send({
                access_token:new_token,
                refresh_token:new_refresh_token
            });
            
        } catch (error) {
            console.log(error);
        }
    }

};


module.exports = new TokenController();