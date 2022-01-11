import { Request, Response, NextFunction } from 'express';
import { User } from "../../user/user.model";
import { Token } from "./token.model";
const bcrypt = require('bcrypt');
import { HashPass } from '../../../utils/helper';




export const updatePassNow = async (req: any, res: Response, next: NextFunction) => {

    try {
        const { userId, token } = req.params
        const newPassword = await HashPass(req.body.password);



        let findToken = Token.findOne({ token: token }, function (err: any, tkon: any) {
            tkon.remove();
        });


        User.findByIdAndUpdate({ _id: userId }, { password: newPassword }, function (err: any, user: any) {
            if (err) {
                return next(err);
                res.status(401).end({ message: "Failed" })
            }
            res.status(201).send({ message: "Success" })
        });




    }

    catch (e) {
        res.status(401).end({ message: "failed" })

    }



}

export const sendResetLink = async (req: any, res: Response, next: NextFunction) => {



    try {

        const { userId, token } = req.locals;


        res.status(201).send({ message: "success" })

    } catch (e) {

        res.status(403).end({ message: "failed" })
    }

}



export const getUserId = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const emailAddress = req.body.email;

        // // validate if the email address already exists
        await User.findOne({ email: emailAddress }).then((user: any) => {
            if (!user) {

                res.status(403).json(' email with same email address doesnt exist')
            }

            req.body.userId = user.id;
            next()


        })

    }
    catch (e) {
        res.status(403).end("nothing found")
    }


}



export const generateAndSaveToken = async (req: any, res: Response, next: NextFunction) => {


    try {

        const { emailAddress, userId } = req.body;

        const generateToken = await Math.random().toString(36).slice(-8);

        let newToken = await Token.create({
            userId: userId,
            token: generateToken
        })

        req.locals = newToken;

        next()

    } catch (e) {
        res.status(403).end({ message: "token generation or saving error occured" })
    }

}