import express from 'express';
import config from './utils/config';
import { connect } from './utils/db';


// EXPRESS JS Basic Stuffs
var app: express.Application = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// security related stuffs below
var helmet = require('helmet')
app.use(helmet())

// cors related
const cors = require('cors');
const corsOptions = require('./utils/cors')
app.use(cors(corsOptions));

// redis related imports
// require('./utils/redis')

const RedisMisc = require('./utils/redis');


// EXPRESS-SESSION
const session = require('express-session');
app.use(session(RedisMisc.sessionData));


// PASSPORT JS
var passport = require('passport');
require('./utils/passport')

app.use(passport.initialize());
app.use(passport.session());


// ROUTES
//user routes
import userRouter from './resources/user/user.router';
app.use('/user', userRouter);

//auth related routes
import authRouter from './resources/auth/auth.routes';
app.use('/auth', authRouter);

import resetPassRouter from './resources/auth/resetPass/token.router';
app.use('/auth', resetPassRouter);


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