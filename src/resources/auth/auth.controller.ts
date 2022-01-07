import { NextFunction, Request, Response } from "express";
import { crudControllers } from "../../utils/cruds";
import { User } from "../user/user.model";
import { BodyData } from "../user/user.types";
const bcrypt = require('bcrypt');


// crud export
export const CrudUser = crudControllers(User)


// signin 
export const signIn = async( req:Request,resp:any) => {
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
    
     console.log(user_info)

    await resp.status(200).send({
            id: user_info._id,
            email: user_info.email
            // accessToken: token,
        });
    } catch(e){
        resp.status(403).send({ message: e })
    }
 
}



// validate signup user data
export const checkUserInfo = async(req:Request,res:Response,next:NextFunction) => {

    const {name,role,password, email} : BodyData = req.body;

    if(!password){
       await res.status(201).json("ERROR: password is empty")
    }

    let errors: boolean = false;

    // first verify email address regex
    if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) === false){
        errors = true;
        res.status(201).json('error with email address format')

    }


    // // validate if the email address already exists
    await User.findOne({email:email}).then((user: any)=>{
        if(user){
            errors = true;
            res.status(403).json(' email with same email address exists')
        }
    })

    if(errors === false) {
    
        next()

    }

 
}