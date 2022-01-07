import { Router } from 'express'

import { signIn } from './auth.controller'
var passport = require('passport');


const routes = Router()


routes
    .route('/signin')
    .post(passport.authenticate('local'), signIn)


    export default routes

