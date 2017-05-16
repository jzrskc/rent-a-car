var express = require('express');
var router = express.Router();
var csrf = require('csurf');

// IMPORT COLLECTION
var Product = require('../models/product');
var Cart = require('../models/cart');

//  CSURF - protection middleware
var csrfProtection = csrf();
router.use(csrfProtection);



// Cart Session - ADD To CART
router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    if(err) res.redirect('/');
    cart.add(product, productId);
    req.session.cart = cart;  // Spremamo cart u Session
    // console.log(req.session.cart);
    res.redirect('/');
  });
});



// Shopping Cart
router.get('/shopping-cart', function(req, res, next) {
  if(!req.session.cart) return res.render('shop/shoppingCart', { products: null });
  var cart = new Cart(req.session.cart);
  res.render('shop/shoppingCart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
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
  var query = {};
  if(req.query.type) {
    query.type = req.query.type;
  }
  Product.find(query, function (err, docs) {

    // HATEOAS
    var returnBooks = [];
    docs.forEach(function(element, index, array) {
      var newBook = element.toJSON();
      newBook.links = 'http://' + req.headers.host + '/' + newBook._id
      returnBooks.push(newBook);
    });

    // Saljemo array "productChunks" u hbs i stavili smo da 3 img mogu biti u 1 redu
    var productChunks = [];
    var chunkSize = 1;
    for (var i = 0; i < returnBooks.length; i += chunkSize) {
      productChunks.push(returnBooks.slice(i, i + chunkSize));
    }
    // res.json(productChunks);
    res.render('shop/index2', { title: 'Rent-a-Car', products: productChunks, csrfToken: req.csrfToken });
  });
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
    if(err) res.status(500).send(err);

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
