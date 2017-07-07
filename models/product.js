var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var memberValidator = [
  function(val) {
    return (val >= 0)
  },
  'Number must be greater than 0'
];

var schema = new Schema({
  imagePath: {type: String, require: true},
  title: {type: String, require: true},
  description: {type: String, require: true},
  type: {type: String, require: true},
  price: {type: Number, require: true},
  carNumber: {type: Number, require: true, validate: memberValidator}
})

module.exports = mongoose.model('Product', schema);
