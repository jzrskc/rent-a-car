var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

// How to save/del user in session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Locaf strategy for SIGNUP
passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, email, password, done) {

  // Provjera/ VALIDATION (ovo je po zelji)
  req.checkBody('email', 'Invalid email').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
  var errors = req.validationErrors();
  if(errors) {
    var messages = [];
    errors.forEach(error => messages.push(error.msg));
    return done(null, false, req.flash('error', messages)); // no err, no success, flash messages
  }

  User.findOne({'email': email}, function (err, user) {
    if (err) return done(err);
    if (user) return done(null, false, {message: 'Email is already in use.'});
    var newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password); //funkcija u models/user.js
    newUser.save(function(err, result) {
      if (err) return done(err);
      return done(null, newUser);
    });
  });
}));

// Locaf strategy for SIGNIN
passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {

    req.checkBody('email', 'Invalid email').isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if(errors) {
      var messages = [];
      errors.forEach(error => messages.push(error.msg));
      return done(null, false, req.flash('error', messages));
    }

    User.findOne({'email': email}, function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, {message: 'No user found.'});
      if (!user.validPassword(password)) {
        return done(null, false, {message: 'Wrong password.'}); //funkcija u models/user.js
      }
      return done(null, user);
    });
}));
