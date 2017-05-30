var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var nodemailer = require('nodemailer');
var validation = require('validator');

var Order = require('../models/order');

/*  Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email. */
var smtpTransport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: "jzrskc@gmail.com",
    pass: "xxx"
  }
});

//  CSURF - protection middleware
var csrfProtection = csrf();
router.use(csrfProtection);


router.get('/profile', isLoggedIn, function(req, res, next) {
  Order.find({user: req.user}, function(err, orders) {
    if(err) return res.write('Error!');
    var orderArr = [];
    orders.forEach(function(order) {
      orderArr.push(order)
    });
    var userMail = req.user.email;
    var name = userMail.match(/^([^@]*)@/)[1];
    var name = name.charAt(0).toUpperCase() + name.slice(1);
    res.render('user/profile', { orders: orderArr, user: name });
  });
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

/* GET CONTACT Form */
router.get('/contact', function(req, res, next) {
  res.render('user/contact', { csrfToken: req.csrfToken, success: req.flash('success'), failure: req.flash('failure') });
});

router.post('/contact',function(req,res){
  if (!validation.isEmail(req.body.email)) {
    req.flash('failure', 'Email incorrect!');
    res.redirect('/user/contact');
  } else if (!validation.isLength(req.body.text, {min:5})) {
    req.flash('failure', 'Text to short, min 5 characters!');
    res.redirect('/user/contact');
  } else {
  var mailOptions={
    // from: "jzrskc@gmail.com",
    to : 'milan@parcellab.com',
    subject : req.body.subject + ' -> ' + req.body.email,
    text : req.body.text
  }
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error) {
      console.log(error);
      // req.flash('failure', JSON.stringify(error));
      req.flash('failure', `Internal error 😞 Please send us email on: jzrskc@gmail.com`);
      res.redirect('/user/contact');
    } else {
    // console.log("Message sent: " + response);
    req.flash('success', 'Mail sent! 😄');
    res.redirect('/user/contact');
    }
  });
  }

});

// |->config/passport
router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), function(req, res, next) {
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile')
  }
});


/* GET SIGNIN page. */
router.get('/signin', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', { csrfToken: req.csrfToken, messages: messages, hasErrors: messages.length > 0 });
});

// |->config/passport
router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), function(req, res, next) {
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile')
  }
});

module.exports = router;


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) return next();
  res.redirect('/');
}
