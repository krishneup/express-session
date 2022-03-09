"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const token_controller_1 = require("./token.controller");
const routes = (0, express_1.Router)();
routes
    .route('/:userId/:token')
    .post(token_controller_1.updatePassNow);
routes
    .route('/resetpass')
    .post(token_controller_1.getUserId, token_controller_1.generateAndSaveToken, token_controller_1.sendResetLink);
exports.default = routes;
