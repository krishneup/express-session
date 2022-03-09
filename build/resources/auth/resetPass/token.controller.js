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
exports.generateAndSaveToken = exports.getUserId = exports.sendResetLink = exports.updatePassNow = void 0;
const user_model_1 = require("../../user/user.model");
const token_model_1 = require("./token.model");
const bcrypt = require('bcrypt');
const helper_1 = require("../../../utils/helper");
const updatePassNow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, token } = req.params;
        const newPassword = yield (0, helper_1.HashPass)(req.body.password);
        let findToken = token_model_1.Token.findOne({ token: token }, function (err, tkon) {
            tkon.remove();
        });
        user_model_1.User.findByIdAndUpdate({ _id: userId }, { password: newPassword }, function (err, user) {
            if (err) {
                return next(err);
                res.status(401).end({ message: "Failed" });
            }
            res.status(201).send({ message: "Success" });
        });
    }
    catch (e) {
        res.status(401).end({ message: "failed" });
    }
});
exports.updatePassNow = updatePassNow;
const sendResetLink = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, token } = req.userDatas;
        res.status(201).send({ message: "success" });
    }
    catch (e) {
        res.status(403).end({ message: "failed" });
    }
});
exports.sendResetLink = sendResetLink;
const getUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailAddress = req.body.email;
        // validate if the email address already exists
        yield user_model_1.User.findOne({ email: emailAddress }).then((user) => {
            if (!user) {
                res.status(403).json(' email with same email address doesnt exist');
            }
            req.body.userId = user.id;
            next();
        });
    }
    catch (e) {
        res.status(403).end("nothing found");
    }
});
exports.getUserId = getUserId;
const generateAndSaveToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { emailAddress, userId } = req.body;
        const generateToken = yield Math.random().toString(36).slice(-8);
        let newToken = yield token_model_1.Token.create({
            userId: userId,
            token: generateToken
        });
        // res.locals.userInfo = newToken;
        req.userDatas = newToken;
        next();
    }
    catch (e) {
        res.status(403).end({ message: "token generation or saving error occured" });
    }
});
exports.generateAndSaveToken = generateAndSaveToken;
