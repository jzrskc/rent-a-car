// Radimo ovu funkciju zato sto ne spremamo podatke u DB
// Ovo je Object, ako dodajemo item prvi put onda je empty JS Object
// On za sada nije spremljen u DB

// Cart = items: { '584589b8f2f00d3ae51a3f10': { qty: 1, item: [Object], price: 10 } }
// this.items[id] = {qty: 0, item: item, price: 0};
var moment = require('moment');


module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

// Funkcija za dodavanje itema u kosaru, svaki ce imati kolicinu i ukupnu cijenu
  this.add = function(item, id, qty, date) {
    var storedItem = this.items[id];
    if (storedItem) {
      this.totalQty -= storedItem.qty;
      this.totalPrice -= storedItem.price;
    }
    var storedItem = this.items[id] = {qty: 0, item: item, price: 0};

    storedItem.qty = parseInt(qty, 10);
    storedItem.startingDate = moment(date).format("MM-DD-YYYY");
    storedItem.endingDate = moment(date).add(qty, 'days').format("MM-DD-YYYY");
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty += storedItem.qty;
    this.totalPrice += storedItem.price;
  };


  this.reduceByOne = function one(id) {
    this.items[id].qty--;
    this.items[id].price -= this.items[id].item.price;
    // this.items[id].endingDate = moment(this.items[id].startingDate).add(this.items[id].qty, "days").format("MM-DD-YYYY");
    this.items[id].endingDate = moment(this.items[id].endingDate).subtract(1, "days").format("MM-DD-YYYY");
    this.totalQty--;
    this.totalPrice -= this.items[id].item.price;

    if (this.items[id].qty <= 0) {
      delete this.items[id];
    }
  }

  this.removeItem = function(id) {
    this.totalQty -= this.items[id].qty;
    this.totalPrice -= this.items[id].price;
    delete this.items[id];
  };

  // Ovaj gore Object pretvaramo u Array
  this.generateArray = function() {
    arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
};
