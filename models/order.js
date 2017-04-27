var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'}, // Znaci da ima veze sa prethodnom shemom, u ovom slucaju 'User'
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    paymentId: {type: String, required: true} // id od svake naplate, nalazi se na STRIPE pod Payments
});

module.exports = mongoose.model('Order', schema);
