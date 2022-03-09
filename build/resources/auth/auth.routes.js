"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
var passport = require('passport');
const routes = (0, express_1.Router)();
routes
    .route('/signin')
    .post(passport.authenticate('local'), auth_controller_1.signIn);
routes
    .route('/register')
    .post(auth_controller_1.checkUserInfo, auth_controller_1.registerAccount);
routes
    .route('/enableac')
    .post(auth_controller_1.enableAccount);
exports.default = routes;
