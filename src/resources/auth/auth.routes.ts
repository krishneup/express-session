import { Router } from 'express'

import { checkUserInfo, CrudUser, signIn, enableAccount, registerAccount } from './auth.controller'
var passport = require('passport');


const routes = Router()


routes
    .route('/signin')
    .post(passport.authenticate('local'), signIn)

routes
    .route('/register')
    .post(checkUserInfo, registerAccount)

routes
    .route('/enableac')
    .post(enableAccount)


export default routes

