import { Request, Response, NextFunction } from 'express';
import { User } from "../../user/user.model";
import { Token } from "./token.model";
const bcrypt = require('bcrypt');



// interface localsExtend extends Request{
//     locals:any;
// }

export const updatePassNow = async(req:any,res:Response,next:NextFunction) => {
    const {userId, token} = req.params
    const newPassword = req.body.password;
    
    await Token.findOne({token:token}).then((token: any)=>{

        if(!token){
           
            res.status(403).json({message:"Token Probably expired or doesnt exist"})
        }

        User.findOneAndUpdate({id:userId},{password:newPassword},{new: true}, (err: any,doc: any) => {
            if(err){
                console.log(err)
            }
            console.log("successfully updated")
        })
        
    })
    
}

export const sendResetLink = async(req:any,res:Response,next:NextFunction) => {



    try{

        const {userId, token} = req.locals;

        console.log(userId)
        console.log(token)

        res.status(201).send({message:"success"})

    } catch(e){

        res.status(403).end({message:"failed"})
    }

}



export const getUserId = async(req:Request,res:Response,next:NextFunction) => {

    try {
        const emailAddress = req.body.emailaddress;

        // // validate if the email address already exists
        await User.findOne({email:emailAddress}).then((user: any)=>{
            if(!user){
               
                res.status(403).json(' email with same email address doesnt exist')
            }

            req.body.userId= user.id;
             next()

            
        })

    }
    catch(e){
        res.status(403).end("nothing found")
    }


}



export const generateAndSaveToken = async(req:any,res:Response,next:NextFunction) => {


    try{

        const {emailAddress, userId} = req.body;

        const generateToken = await Math.random().toString(36).slice(-8);
        
        let newToken =  await Token.create({
            userId:userId,
            token:generateToken
        })

        req.locals = newToken;

        // console.log(req.locals)
        next()
       
    } catch(e){
        res.status(403).end({message:"token generation or saving error occured"})
    }
    
}