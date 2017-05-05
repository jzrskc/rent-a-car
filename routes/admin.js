var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

//  CSURF - protection middleware
var csrfProtection = csrf();
router.use(csrfProtection);

var Product = require('../models/product');

// router.get('/', function(req, res, next) {
//   var query = {};
//   Product.find(query, function(err, doc) {
//     res.render('admin/admin', {title: 'Rent-a-Car', items: doc, csrfToken: req.csrfToken});
//   });
// });

router.get('/', isLoggedIn, verifyAdmin, function(req, res, next) {
  var query = {};
  Product.find(query, function(err, doc) {
    res.render('admin/admin', {title: 'Rent-a-Car', items: doc, csrfToken: req.csrfToken});
  });
});



// INSERT
router.post('/insert', function(req, res, next) {
  var item = {
    imagePath: req.body.imagePath,
    title: req.body.title,
    description: req.body.description,
    type: req.body.type,
    price: req.body.price
  };

  var data = new Product(item);
  data.save();

  res.redirect('/admin');
});



// UPDATE
router.post('/update', function(req, res, next) {
  var id = req.body.id;

  Product.findById(id, function(err, doc) {
    if (err) console.error('error, no entry found');

    doc.imagePath = req.body.imagePath;
    doc.title = req.body.title;
    doc.description = req.body.description;
    doc.type = req.body.type;
    doc.price = req.body.price;
    doc.save();
  })
  res.redirect('/admin');
});


// DELETE
router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  Product.findByIdAndRemove(id).exec();
  res.redirect('/admin');
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

function verifyAdmin (req, res, next){
  if(req.user.admin) return next();
  res.redirect('/');
};
