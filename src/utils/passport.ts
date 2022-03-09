import { validatePassword } from "../resources/auth/auth.controller";
import { User } from "../resources/user/user.model";

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;




passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
  },
  
    function(email:any, password:any, done:any) {
  
      // console.log("email")
      User.findOne({ email: email }, function (err: any, user:any) {
        
        
  
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
  
        // validate password here
        if(!validatePassword(user.password, password)) {
          return done(null, false)
        }
  
  
        return done(null, user);
      });
    }
  ));
  
  
  
  passport.serializeUser(function(user: { id: any; }, done: (arg0: null, arg1: any) => void) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id: any, done: (arg0: any, arg1: any) => void) {
    User.findById(id, function(err: any, user: any) {
      const newuserData = {
        id:user.id,
        email:user.email
      }
      done(err, newuserData);
    });
  });
  




