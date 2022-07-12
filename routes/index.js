var express = require('express');
var router = express.Router();
var userModel = require('./users');
var passport = require('passport');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index');
});

router.get('/res', function (req, res) {
  res.render('res');
});
router.get('/order', function (req, res) {
  res.render('order');
});
router.get('/cart', function (req, res) {
  res.render('cart');
});
router.get('/checkout', function (req, res) {
  res.render('checkout');
});
router.get('/thankyou', function (req, res) {
  res.render('Thankyou');
});
router.get('/back', function (req, res) {
  res.redirect('back');
});

router.post('/register', function (req, res) {
  var newUser = new userModel({
    username: req.body.username,
    name: req.body.name,
    mobilenumber: req.body.number
  })
  userModel.register(newUser, req.body.password)
    .then(function (u) {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/order');
      })
    })
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/order',
  failureRedirect: '/'
}), function (req, res, next) { });

router.get('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    res.redirect('/');
  }
}
function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/profile');
  }
  else {
    return next();
  }
}

module.exports = router;
