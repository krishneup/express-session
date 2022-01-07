import express, { Request, Response, NextFunction } from 'express';
// import { connection } from 'mongoose';
import { User } from './resources/user/user.model';
import config from './utils/config';
const cors = require('cors');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
import { connect } from './utils/db';
const mongoose = require('mongoose');

// auth related imports
const session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo');

import authRouter from './resources/auth/auth.routes'




var app:any = express();


var helmet = require('helmet')
app.use(helmet())


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
},

  function(email:any, password:any, done:any) {

    // console.log("email")
    User.findOne({ email: email }, function (err: any, user: { verifyPassword: (arg0: any) => any; }) {
      
      // console.log(user)

      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      // if (!user.verifyPassword(password)) { return done(null, false); }

      return done(null, user);
    });
  }
));

/**
 * This function is used in conjunction with the `passport.authenticate()` method.  See comments in
 * `passport.use()` above ^^ for explanation
 */
 passport.serializeUser(function(user: { id: any; }, cb: (arg0: null, arg1: any) => void) {
  cb(null, user.id);
});

/**
* This function is used in conjunction with the `app.use(passport.session())` middleware defined below.
* Scroll down and read the comments in the PASSPORT AUTHENTICATION section to learn how this works.
* 
* In summary, this method is "set" on the passport object and is passed the user ID stored in the `req.session.passport`
* object later on.
*/
passport.deserializeUser(function(id: any, cb: any) {
  User.findById(id, function (err: any, user: any) {
      if (err) { return cb(err); }
      cb(null, user);
  });
});


// const sessionStore = new MongoStore({ mongoUrl: 'mongodb://localhost:27017/mytest', collectionName:'sessions'	 })
const sessionStore = new MongoStore({ mongoUrl: 'mongodb://localhost:27017/mytest', collectionName:'sessions'	 })


app.use(session({
  //secret: process.env.SECRET,
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
      maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
  }
}));


app.use(passport.initialize());
app.use(passport.session());


app.use('/auth', authRouter);


const start = async () => {
  try {
    await connect()
    app.listen(config.port, () => {
     console.log(`working on port ${config.port}`)
    })
  } catch (e) {
    console.error(e)
  }
}

start()