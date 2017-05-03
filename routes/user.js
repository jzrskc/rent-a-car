var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

//  CSURF - protection middleware
var csrfProtection = csrf();
router.use(csrfProtection);


router.get('/profile', isLoggedIn, function(req, res, next) {
  res.render('user/profile');
});

router.get('/logout', isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect('/');
});

// Ove ispod route, ako notLoggedIn -> '/'
router.use('/', notLoggedIn, function(req, res, next) {
  next();
});

/* GET SIGNUP page. */
router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken, messages: messages, hasErrors: messages.length > 0 });
});

// |->config/passport
router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));


/* GET SIGNIN page. */
router.get('/signin', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', { csrfToken: req.csrfToken, messages: messages, hasErrors: messages.length > 0 });
});

// |->config/passport
router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}));

module.exports = router;



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) return next();
  res.redirect('/');
}
