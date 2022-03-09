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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_model_1 = require("./resources/user/user.model");
const config_1 = __importDefault(require("./utils/config"));
const cors = require('cors');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db_1 = require("./utils/db");
const mongoose = require('mongoose');
const os_1 = require("os");
const numCPUs = (0, os_1.cpus)().length;
console.log(numCPUs);
// auth related imports
const session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo');
const auth_routes_1 = __importDefault(require("./resources/auth/auth.routes"));
const user_router_1 = __importDefault(require("./resources/user/user.router"));
const token_router_1 = __importDefault(require("./resources/auth/resetPass/token.router"));
const auth_controller_1 = require("./resources/auth/auth.controller");
var app = (0, express_1.default)();
var helmet = require('helmet');
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    exposedHeaders: ['Date', 'Uid', 'ETag'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // exposedHeaders: 'X-Total-Results',
    "preflightContinue": true,
};
// app.use(helmet())
app.use(cors(corsOptions));
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// // Add headers
// app.use(function (req:any, res:any, next:any) {
//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Expose-Headers', 'Access-Token, Uid');
//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   // Pass to next layer of middleware
//   next();
// });
// app.use((req:any, res:any, next:any) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   next();
// }) 
// app.use(cors({ origin: true }));
// app.use(cors());
app.use(logger('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express_1.default.static(path.join(__dirname, 'public')));
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {
    // console.log("email")
    user_model_1.User.findOne({ email: email }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        // validate password here
        if (!(0, auth_controller_1.validatePassword)(user.password, password)) {
            return done(null, false);
        }
        return done(null, user);
    });
}));
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    user_model_1.User.findById(id, function (err, user) {
        const newuserData = {
            id: user.id,
            email: user.email
        };
        done(err, newuserData);
    });
});
const sessionStore = new MongoStore({ mongoUrl: 'mongodb://localhost:27017/mytest', collectionName: 'sessions' });
app.use(session({
    //secret: process.env.SECRET,
    secret: 'some secret',
    resave: true,
    saveUninitialized: false,
    store: sessionStore,
    // rolling: true,
    cookie: {
        // maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
        maxAge: 100 * 1000,
        httpOnly: false
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', auth_routes_1.default);
app.use('/auth', token_router_1.default);
app.use('/user', user_router_1.default);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connect)();
        app.listen(config_1.default.port, () => {
            console.log(`working on port ${config_1.default.port}`);
        });
    }
    catch (e) {
        console.error(e);
    }
});
start();
