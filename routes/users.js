const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
mongoose.connect('mongodb://localhost/KiKi');

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  number: String,
  order: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  cart:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  default:[]
  });

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);