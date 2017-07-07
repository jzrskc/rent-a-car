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
    res.render('admin/addCar', {title: 'Rent-a-Car', items: doc, csrfToken: req.csrfToken});
  });
});

// Get Update
router.get('/update/:id', isLoggedIn, verifyAdmin, function(req, res, next) {
  var id = req.params.id;

  Product.findById(id, function(err, doc) {
    if (err) console.error('error, no entry found');
    var docs = doc;
    console.log(docs);
    res.render('admin/update', {id: id, docs: docs, csrfToken: req.csrfToken});
  });
});



// INSERT
router.post('/insert', function(req, res, next) {
  var item = {
    imagePath: req.body.imagePath,
    title: req.body.title,
    description: req.body.description,
    type: req.body.type,
    price: req.body.price,
    carNumber: req.body.carNumber
  };

  var data = new Product(item);
  data.save();

  res.redirect('/');
});


// DELETE
router.post('/delete/:id', function(req, res, next) {
  var id = req.params.id;
  console.log(id);
  Product.findByIdAndRemove(id).exec();
  console.log("Done !!!");
  res.redirect('/');
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
