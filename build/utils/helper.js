"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashPass = void 0;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const HashPass = (plainPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
            bcrypt.hash(plainPassword, salt, function (err, hash) {
                resolve(hash);
                reject("hashing error occured");
            });
        });
    });
};
exports.HashPass = HashPass;
