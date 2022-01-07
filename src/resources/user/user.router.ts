import { Router } from 'express'
import {CrudUser } from './user.controller'
var passport = require('passport');



const routes = Router()


export const ensureAuthenticated = async(req:any, res:any, next:any) => {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}

export const belongstoUser = (req:any, res:any, next:any) => {

    // console.log()
    if(req.user.id !== req.params.id){
        res.redirect('/login')
    }
    next();
}


// routes
//     .route('/')
//     // .get(verifyAccessToken, CrudUser.getMany)
//     // .post(checkUserInfo, CrudUser.createOne)

routes
    .route('/:id')
    .get(ensureAuthenticated, belongstoUser, CrudUser.getOne)


export default routes;

