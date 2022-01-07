import { Router } from 'express'

import { checkUserInfo, CrudUser, signIn } from './auth.controller'
var passport = require('passport');


const routes = Router()


routes
    .route('/signin')
    .post(passport.authenticate('local'), signIn)

routes
    .route('/register')
    .post(checkUserInfo, CrudUser.createOne)


export default routes

