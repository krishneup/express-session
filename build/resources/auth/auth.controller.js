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
exports.registerAccount = exports.enableAccount = exports.checkUserInfo = exports.signIn = exports.validatePassword = exports.CrudUser = void 0;
const cruds_1 = require("../../utils/cruds");
const user_model_1 = require("../user/user.model");
const bcrypt = require('bcrypt');
// crud export
exports.CrudUser = (0, cruds_1.crudControllers)(user_model_1.User);
// validate password
// returns True/false
const validatePassword = (dbPassword, clientProvidedPassword) => {
    return bcrypt.compareSync(clientProvidedPassword, dbPassword);
};
exports.validatePassword = validatePassword;
// signin 
const signIn = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield resp.status(200).send({
            id: req.user
        });
    }
    catch (e) {
        resp.status(403).end({ message: e });
    }
});
exports.signIn = signIn;
// validate signup user data
const checkUserInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, email } = req.body;
    if (!password) {
        yield res.status(201).json("ERROR: password is empty");
    }
    let errors = false;
    // first verify email address regex
    if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) === false) {
        errors = true;
        res.status(201).json('error with email address format');
    }
    // // validate if the email address already exists
    yield user_model_1.User.findOne({ email: email }).then((user) => {
        if (user) {
            errors = true;
            res.status(403).json(' email with same email address exists');
        }
    });
    if (errors === false) {
        next();
    }
});
exports.checkUserInfo = checkUserInfo;
const enableAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, email } = req.body;
        const user_info = yield user_model_1.User.findOne({
            email: req.body.email
        });
        if (token !== user_info.acc_status.token) {
            res.status(401).end({ message: "token information rejected/not valid" });
        }
        user_model_1.User.findByIdAndUpdate({ _id: user_info.id }, { 'acc_status.is_active': true }, function (err, user) {
            if (err) {
                res.status(201).end({ message: "Failed" });
            }
            res.status(201).send({ message: "Success" });
        });
    }
    catch (e) {
        res.status(401).end({ message: "error catched" });
    }
});
exports.enableAccount = enableAccount;
const registerAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email } = req.body;
        const registerAc = yield user_model_1.User.create({
            email: email,
            password: password
        })
            .then((user) => {
            if (!user)
                res.status(401).end({ message: "Failed" });
            res.status(201).send({ message: "Success" });
        });
    }
    catch (e) {
        res.status(401).end({ message: "error catched" });
    }
});
exports.registerAccount = registerAccount;
