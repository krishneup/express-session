import { Request, Response, NextFunction } from 'express';
import { User } from "../../user/user.model";
import { token } from "./token.model";



interface localsExtend extends Request{
    locals:any;
}



export const sendResetLink = async(req:localsExtend,res:Response,next:NextFunction) => {


    const {userId, token} = req.locals;

    
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



export const generateAndSaveToken = async(req:localsExtend,res:Response,next:NextFunction) => {


    try{

        const {emailAddress, userId} = req.body;

        const generateToken = await Math.random().toString(36).slice(-8);
        
        let newToken =  await token.create({
            userId:userId,
            token:generateToken
        })

        req.locals = newToken;
       
    } catch(e){
        res.status(403).end({message:"token generation or saving error occured"})
    }
    
}