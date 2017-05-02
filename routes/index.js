var express = require('express');
var router = express.Router();

// IMPORT COLLECTION
var Product = require('../models/product');

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

    res.render('shop/index2', { title: 'Rent-a-Car', products: productChunks });
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

////////////////////////////////////////////
// HATEOAS to filter by this current type //
////////////////////////////////////////////

      else {
        var returnBook = book.toJSON();

        returnBook.links = {};
        var newLink = 'http://' + req.headers.host + '/?type=' + returnBook.type;
        returnBook.links = newLink.replace(' ', '%20');
        // console.log(returnBook.links);
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
  })

module.exports = router;
