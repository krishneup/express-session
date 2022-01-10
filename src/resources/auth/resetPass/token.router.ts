import { Router } from "express";

import { generateAndSaveToken, getUserId, sendResetLink } from "./token.controller";
const routes = Router()

// routes
//     .route('/:userId/:token')
//     .post()


routes
    .route('/resetpass')
    .post(getUserId, generateAndSaveToken, sendResetLink)

export default routes
