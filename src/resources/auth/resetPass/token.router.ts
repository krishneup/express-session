import { Router } from "express";

import { generateAndSaveToken, getUserId, sendResetLink, updatePassNow} from "./token.controller";
const routes = Router()

routes
    .route('/:userId/:token')
    .post(updatePassNow)


routes
    .route('/resetpass')
    .post(getUserId, generateAndSaveToken, sendResetLink)

export default routes
