const express = require('express');
const router = express.Router();
var orderModel=require('./order');
const userModel = require('./users');
const passport = require('passport');
const razorpay = require('razorpay');
const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 10000)
    cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
  }
})

const upload = multer({ storage: storage })

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

const instance = new razorpay({
  key_id: 'rzp_test_hZUEKNvCfMICwO',
  key_secret: 'dd537sW0c6HggaDgShToZCR9',
});

/* GET home page. */
router.get('/', checkLoggedIn, function (req, res) {
  res.render('index');
});

router.get('/res', function (req, res) {
  res.render('res');
});
router.get('/order',isLoggedIn, function (req, res) {
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
router.get('/uploadfood', function (req, res) {
  res.render('uploadfood');
});

// router.get('/addfood', function (req, res) {
//   userModel.findOne({ username: })
// });

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
    res.redirect('/order');
  }
  else {
    return next();
  }
}

module.exports = router;
