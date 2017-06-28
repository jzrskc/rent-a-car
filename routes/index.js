var express = require('express');
var router = express.Router();
var csrf = require('csurf');

// IMPORT COLLECTION
var Product = require('../models/product');
var Order = require('../models/order');
var Cart = require('../models/cart');

//  CSURF - protection middleware
var csrfProtection = csrf();
router.use(csrfProtection);



// Cart Session - ADD To CART
router.get('/add-to-cart/:id', function(req, res, next) {
  if (req.query.numDays < 1) {
    return res.redirect('back');
  } else {
  var productId = req.params.id;
  var numDays = req.query.numDays;

  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    if(err) res.redirect('/');
    cart.add(product, productId, numDays);
    req.session.cart = cart;  // Spremamo cart u Session
    // console.log(req.session.cart);
    res.redirect('/');
  });
}
});



// Shopping Cart
router.get('/shopping-cart', function(req, res, next) {
  if(!req.session.cart) return res.render('shop/shoppingCart', { products: null });
  var cart = new Cart(req.session.cart);
  res.render('shop/shoppingCart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
});



/* GET CHECKOUT */
router.get('/checkout', isLoggedIn, function(req, res, next) {
  if (req.session.cart.totalPrice === 0) return res.redirect('/shopping-cart');
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', { total: cart.totalPrice, csrfToken: req.csrfToken, errMsg: errMsg, noError: !errMsg })
});



// CHARGES & STORING ORDERS
router.post('/checkout', isLoggedIn, function(req, res, next) {
  if (req.session.cart.totalPrice === 0) return res.redirect('/shopping-cart');
  var cart = new Cart(req.session.cart);

  var stripe = require("stripe")("sk_test_BkCrSM0YI4mNJ5G1C4zRULE4");

  stripe.charges.create({
    amount: cart.totalPrice * 100, // vrijednost u cent, lipe...,
    currency: "eur",
    source: req.body.stripeToken, // obtained with Stripe.js  // checkout.js hidden element
    description: "Test Charge"
  }, function(err, charge) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    var order = new Order({
      user: req.user, //passport - radi samo ako je user logiran
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save(function(err, result) {
      if(err) res.status(500).send(err);
      req.flash('success', 'Successfully rented car! 😄');
      req.session.cart = null;
      res.redirect('/');
    });
  });

});


// Reduc by 1
router.get('/reduce/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

// Remove
router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});



/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0]; // car rented
  var query = {};
  if(req.query.type) {
    query.type = req.query.type;
  }
  Product.find(query, function (err, docs) {

    // HATEOAS
    var returnBooks = [];
    docs.forEach(function(element, index, array) {
      var newBook = element.toJSON();
      newBook.links = 'http://' + req.headers.host + '/' + newBook._id;
      returnBooks.push(newBook);
    });

    // Saljemo array "productChunks" u hbs i stavili smo da 3 img mogu biti u 1 redu
    var productChunks = [];
    var chunkSize = 1;
    for (var i = 0; i < returnBooks.length; i += chunkSize) {
      productChunks.push(returnBooks.slice(i, i + chunkSize));
    }
    // res.json(productChunks);
    res.render('shop/index2', { title: 'Rent-a-Car', products: productChunks, csrfToken: req.csrfToken, successMsg: successMsg, noMessages: !successMsg });
  });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('shop/about');
});


// PERSONAL OR TERRAIN
router.post('/', function(req, res) {
  if (req.body.carName.length) {
    res.redirect('http://' + req.headers.host + '/?type=' + req.body.carName);
  } else {
    res.redirect('/');
  }
});


/* GET SPECIFIC CAR. */
router.get('/:carId', function(req, res, next) {
  Product.findById(req.params.carId, function(err,book){
    if(err) return next();

    // HATEOAS to filter by this current type
    else {
      var returnBook = book.toJSON();
      returnBook.links = {};
      var newLink = 'http://' + req.headers.host + '/?type=' + returnBook.type;
      returnBook.links = newLink.replace(' ', '%20');
      // res.json(returnBook);

      y = [];
      y.push(returnBook);

      var productChunks2 = [];
      var chunkSize = 1;
      for (var i = 0; i < y.length; i += chunkSize) {
        productChunks2.push(y.slice(i, i + chunkSize));
      }
      // res.json(productChunks2);
      res.render('shop/singleCar', { title: 'Rent-a-Car', products: productChunks2 });
    }

    });
  });

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.session.oldUrl = req.url; // na ovaj nacin pristupamo proslom url, kada napravimo SignIn da nas vrati na taj Url
  res.redirect('/user/signin');
}
