const express = require('express');
const router = express.Router();
var orderModel = require('./order');
const userModel = require('./users');
const passport = require('passport');
const razorpay = require('razorpay');
const multer = require('multer');

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));


const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GOOGLE_CLIENT_ID = '49142768196-nnflv13nom43sa6vkluoesl9olo2jlog.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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'
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/google/authenticated",
  passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

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
router.get('/order', isLoggedIn, function (req, res) {
  orderModel.find({}, function (err, order) {
    if (err) {
      console.log(err);
    } else {
      res.render('order', { order: order });
    }
  });
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
router.get('/uploadfood', isLoggedIn, function (req, res) {
  res.render('uploadfood');
});

// router.get('/addfood', function (req, res) {
//   userModel.findOne({ username: req.session.passport.user})
// });


router.get('/food/:name', function (req, res) {
  orderModel.distinct('foodName', function (err, foundfood) {
    const cpy = foundfood.filter(function (data) {
      if (data.toLowerCase().includes(req.params.name.toLowerCase())) {
        return data;
      }
    })
    res.json({ foundfood: cpy });
  })
});
router.get('/searchfood/:name', function (req, res) {
  orderModel.find({ foodName: req.params.name })
    .then(function (foundfood) {
      res.json({ foundfood: foundfood });
    })
});

router.get('/cart', isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user.username })
    .populate('cart')
    .then(function (founduser) {
      console.log(founduser)
      res.render('cart', { founduser })
    })
});

router.get('/addToCart/:id', isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user.username })
    .then(function (founduser) {
      orderModel.findOne({ _id: req.params.id })
        .then(function (foundpost) {
          founduser.cart.push(foundpost._id)
          founduser.save()
          res.redirect('/order')
        })
    })
});

router.post('/addfood', isLoggedIn, upload.single('foodImage'), function (req, res) {
  userModel.findOne({ username: req.session.passport.user.username })
    .then(function (data) {
      orderModel.create({
        foodName: req.body.foodName,
        foodPrice: req.body.foodPrice,
        foodTime: req.body.foodTime,
        foodRating: req.body.foodRating,
        foodImage: req.file.filename,
        foodOwner: data._id
      })
        .then(function (addfood) {
          res.redirect('/order');
        })
    })

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
router.get('/google/auth', passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/authenticated', passport.authenticate('google', {
  successRedirect: '/order',
  failureRedirect: '/'
}), function (req, res) { })

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
