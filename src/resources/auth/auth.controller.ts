import { Request, Response } from "express";
import { User } from "../user/user.model";
const bcrypt = require('bcrypt');


// signin 
export const signIn = async( req:Request,resp:any) => {
    // console.log(err)
    try {
     const user_info = await User.findOne({
         email: req.body.email
     })
     
     console.log(user_info.email)
     if(user_info){
         var passwordIsValid = await bcrypt.compareSync(
             req.body.password,
             user_info.password
           );
     }
 
     if (!passwordIsValid) {
         resp.status(401).send({
             accessToken: null,
             message: "Invalid Password!"
         });
     }
 
     //generate refresh token
    //  var token = await generateToken(user.id);
 
     //generate refresh token and saved in DB : FUNCTION
     //important - do not remove this
    //  var refresh_token = await generateRefreshToken(user.id);
    
     console.log(user_info)

    await resp.status(200).send({
            // id: user_info._id
            // email: user.email
            // accessToken: token,
        });
    } catch(e){
        resp.status(403).send({ message: e })
        // resp.json({error: 'an error occurred'});

        // console.log(e)
    }
 
}