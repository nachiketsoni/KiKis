const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
mongoose.connect('mongodb://localhost/KiKi');

const userSchema = new mongoose.Schema({
  number: String,
  name: String,
  username: String,
  password: String,
});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);