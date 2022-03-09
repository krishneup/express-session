"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.belongstoUser = exports.ensureAuthenticated = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
var passport = require('passport');
const routes = (0, express_1.Router)();
const ensureAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.user)
    // req.session.destroy()
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
});
exports.ensureAuthenticated = ensureAuthenticated;
const belongstoUser = (req, res, next) => {
    // console.log(req.session.passport.user)
    if (req.user.id !== req.params.id) {
        res.redirect('/login');
    }
    next();
};
exports.belongstoUser = belongstoUser;
// routes
//     .route('/')
//     // .get(verifyAccessToken, CrudUser.getMany)
//     // .post(checkUserInfo, CrudUser.createOne)
routes
    .route('/:id')
    .get(exports.ensureAuthenticated, exports.belongstoUser, user_controller_1.CrudUser.getOne);
exports.default = routes;
