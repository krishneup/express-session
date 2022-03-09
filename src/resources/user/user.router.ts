import { Router } from 'express'
import {CrudUser, ensureAuthenticated, belongstoUser } from './user.controller'



const routes = Router()

routes
    .route('/:id')
    .get(ensureAuthenticated, belongstoUser, CrudUser.getOne)
    // .get( CrudUser.getOne)


routes
    .route('/')
    // for testing only, this exposes password
    // .get(CrudUser.getMany)


export default routes;

