import { NextFunction, Request, Response } from "express";
import { crudControllers } from "../../utils/cruds";
import { User } from "../user/user.model";
import { UserTypes } from "../user/user.types";
const bcrypt = require('bcrypt');


// crud export
export const CrudUser = crudControllers(User)


// validate password
// returns True/false
export const validatePassword = (dbPassword:String, clientProvidedPassword:String) => {
    return bcrypt.compareSync(
        clientProvidedPassword,
        dbPassword
    )
}


// signin 
export const signIn = async (req: any, resp: Response) => {
    try {

        

        await resp.status(200).send({
            id: req.user
            
        });
    } catch (e) {
        resp.status(403).end({ message: e })
    }

}



// validate signup user data
export const checkUserInfo = async (req: Request, res: Response, next: NextFunction) => {

    const { password, email }: UserTypes = req.body;

    if (!password) {
        await res.status(201).json("ERROR: password is empty")
    }

    let errors: boolean = false;

    // first verify email address regex
    if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) === false) {
        errors = true;
        res.status(201).json('error with email address format')

    }


    // // validate if the email address already exists
    await User.findOne({ email: email }).then((user: any) => {
        if (user) {
            errors = true;
            res.status(403).json(' email with same email address exists')
        }
    })

    if (errors === false) {

        next()

    }


}

export const enableAccount = async (req: Request, res: Response) => {
    try {

        const { token, email } = req.body;

        const user_info = await User.findOne({
            email: req.body.email
        })

        if (token !== user_info.acc_status.token) {
            res.status(401).end({ message: "token information rejected/not valid" })
        }

        User.findByIdAndUpdate({ _id: user_info.id }, { 'acc_status.is_active': true }, function (err: any, user: any) {
            if (err) {
                res.status(201).end({ message: "Failed" })
            }
            res.status(201).send({ message: "Success" })
        });

    }
    catch (e) {
        res.status(401).end({ message: "error catched" })
    }
}


export const registerAccount = async (req: Request, res: Response) => {

    try {

        const { password, email }: UserTypes = req.body;


        const registerAc = await User.create({
            email: email,
            password: password
        })
            .then((user: any) => {
                if (!user) res.status(401).end({ message: "Failed" })
                res.status(201).send({ message: "Success" })

            })
    }
    catch (e) {
        res.status(401).end({ message: "error catched" })
    }
}