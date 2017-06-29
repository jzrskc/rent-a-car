var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var nodemailer = require('nodemailer');
var validation = require('validator');
var moment = require('moment');

var Order = require('../models/order');
var User = require('../models/user');

/*  Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email. */
var smtpTransport = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});


//  CSURF - protection middleware
var csrfProtection = csrf();
router.use(csrfProtection);

/* GET CONTACT Form */
router.get('/contact', function(req, res, next) {
  // var time = moment().diff(moment().hour(16), 'hours');
  var now = moment().utcOffset(2);
  var nowHour = moment().utcOffset(2).hour();
  if (nowHour > 16 || nowHour < 8) {
    var timeMsg = `Our office is open from 8 in a morning!`;
  } else {
    var endTime = now.hour(16).minute(0);
    var timeDiff = moment(endTime).fromNow();
    var timeMsg = `Our office will be closed ${timeDiff}!`;
  }

  res.render('user/contact', { csrfToken: req.csrfToken, success: req.flash('success'), failure: req.flash('failure'), timeMsg: timeMsg });
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
    to : process.env.MAIL_RECEIVER,
    subject : req.body.subject + ' -> ' + req.body.email,
    text : req.body.text
  }
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error) {
      console.log(error);
      req.flash('failure', `Internal error 😞 Please send us email on: jzrskc@gmail.com`);
      res.redirect('/user/contact');
    } else {
    req.flash('success', 'Mail sent! 😄');
    res.redirect('/user/contact');
    }
  });
  }

});


/* GET Profile page */
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
    res.render('user/profile', { orders: orderArr, userName: name, csrfToken: req.csrfToken, });
  });
});

router.post('/profile', function(req, res, next) {
  User.findById(req.user._id, function(err, doc) {
    if (err)  console.error('error, no entry found');
    doc.email = req.body.email;
    doc.save();
  });
  res.redirect('back');
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
