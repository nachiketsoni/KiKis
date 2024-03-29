const express = require("express");
const router = express.Router();
var orderModel = require("./order");
const userModel = require("./users");
const passport = require("passport");
const Razorpay = require("razorpay");
const multer = require("multer");
const resModel = require("./restaurant")
const { google } = require("googleapis");
const moment = require("moment");
const apiKey = "AIzaSyDKboj8Db_BbLa8TV7DnBhhTRiO7jw4OVY";
const youtube = google.youtube({
  version: "v3",
  auth: apiKey,
});

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
var instance = new Razorpay({
  key_id: "rzp_test_IiBBE2SNfjNWi6",
  key_secret: "QvKYuE79SLrdE3OLlXZ8RmCw",
});

router.get("/bot/search/:message", async (req, res, next) => {
  console.log(req.params.message);
  // res.json(req.params.id)
  try {
    const searchQuery = req.params.message;
    const response = await youtube.search.list({
      part: "snippet",
      q: searchQuery,
      type: "video",
    });
    const titles = response.data.items.map((item) => item.snippet.title);
    const ids = response.data.items;
    console.log(titles);
    res.send(response.data.items);
  } catch (err) {
    console.log(err);
    next();
  }
});

router.post("/create/orderId", function (req, res, next) {
  var options = {
    amount: req.body.amount + "00", // amount in the smallest currency unit
    currency: "INR",
    receipt:
      "order_rcptid_11" + Math.floor(Math.random() * 100000000000) + Date.now(),
  };

  instance.orders.create(options, function (err, order) {
    res.send({ orderId: order });
  });
});
router.post("/api/payment/verify", (req, res) => {
  let body =
    req.body.response.razorpay_order_id +
    "|" +
    req.body.response.razorpay_payment_id;

  var crypto = require("crypto");
  var expectedSignature = crypto
    .createHmac("sha256", "QvKYuE79SLrdE3OLlXZ8RmCw")
    .update(body.toString())
    .digest("hex");
  // console.log("sig received ", req.body.response.razorpay_signature);
  // console.log("sig generated ", expectedSignature);
  var response = { signatureIsValid: "false" };
  if (expectedSignature === req.body.response.razorpay_signature) {
    response = { signatureIsValid: "true" };
  }
  res.send(response);
});

const GoogleStrategy = require("passport-google-oauth2").Strategy;
const GOOGLE_CLIENT_ID =
  "49142768196-nnflv13nom43sa6vkluoesl9olo2jlog.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/google/authenticated",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      var newUser = new userModel({
        username: profile.email,
        name: profile.displayName,
        number: "",
      })
        .save()
        .then((newr) => {
          return done(null, newr);
        });
    }
  )
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 10000);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

/* GET home page. */
router.get("/", checkLoggedIn, function (req, res) {
  res.render("index");
});

router.get("/res",isLoggedIn,async function (req, res) {
  const user = await userModel.findOne({ username: req.user.username });
  console.log(user);
  res.render("res",{user});
});
router.get("/myres",isLoggedIn,async function (req, res) {
  // const user = await userModel.findOne({ username: req.user.username })

  const restaurants = await resModel.find().populate("restaurantOwner")

  // console.log(user);
  res.render('myrest',{restaurants});
});
router.get("/theres/:id",isLoggedIn,async function (req, res) {
  const user = await userModel.findOne({ username: req.user.username})

  const restaurants = await resModel.findOne({_id:req.params.id}).populate("restaurantOwner")

  // console.log(user);
  res.render('singleres',{restaurants,user});
});
router.get("/resdata",async function (req, res) {
  // const user = await userModel.findOne({ username: req.user.username })

  const restaurants = await resModel.find().populate("restaurantOwner")
  const user = await userModel.find().populate("cart");
  
  // var lolo = restaurants.map((rest) => {rest.restaurantOwner.cart.populate()})
  
    
    // console.log(restaurants[1].restaurantOwner,user);
    res.send([restaurants]);
  })


router.post("/createRes",isLoggedIn,  function (req, res) {

   userModel.findOne({ username: req.user.username })
   .then((User)=>{

      resModel.create({
       storeName:req.body.storeName,
       storeAddress:req.body.storeAddress,
       since:moment().format('LL'),
       restaurantOwner:User._id
     })
     .then((resDetails)=>{
      User.restaurant.push(resDetails._id)
      User.save()
       res.send(resDetails)
       console.log(User);
    })
   
   })

  // res.render("res");
});
router.get("/order", isLoggedIn, async function (req, res) {
  // console.log(req.user);
  const user = await userModel.findOne({ username: req.user.username });
  // console.log(user);
  const order = await orderModel.find().populate("foodOwner");
  res.render("order", { order, user: user.cart });
});
router.get("/orderm", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user.username,
  });
  const order = await orderModel.find().populate("foodOwner");
  res.json({ order, user: user.cart });
});

router.post("/updatefilter", async function (req, res) {
  let order = await orderModel.find();
  filteredorder = await req.body.sortedArr;
  for (i = 0; i < order.length; i++) {
    order[i] = filteredorder[i];
  }
  // console.log(order)
  res.send(order);
});

router.get("/checkout", isLoggedIn, function (req, res) {
  userModel
    .findOne({ username: req.session.passport.user.username })
    .populate("cart")
    .then(function (founduser) {
      var subtotal = 0;
      founduser.cart.forEach(function (data) {
        subtotal += parseInt(data.foodPrice * data.foodQuantity);
      });
      res.render("checkout", { founduser, subtotal });
    });
});
router.get("/thankyou", isLoggedIn, function (req, res) {
  res.render("Thankyou");
});
router.get("/back", isLoggedIn, function (req, res) {
  res.redirect("back");
});
router.get("/uploadfood", isLoggedIn, function (req, res) {
  res.render("uploadfood");
});

router.get("/food/:name", isLoggedIn, function (req, res) {
  orderModel.distinct("foodName", function (err, foundfood) {
    console.log(req.params.name.split(' ').toLowerCase());
    
    const cpy = foundfood.filter(function (data) {
      if (data.toLowerCase().includes(req.params.name.toLowerCase())) {
        return data;
      }
    });
    res.json({ foundfood: cpy });
  });
});

router.get("/searchfood/:name", isLoggedIn, function (req, res) {
  orderModel
    .find({ foodName: req.params.name })
    .populate("foodOwner")
    .then(function (foundfood) {
      res.json({ foundfood: foundfood });
    });
});

router.get("/cart", isLoggedIn, function (req, res) {
  userModel
    .findOne({ username: req.session.passport.user.username })
    .populate("cart")
    .then(function (founduser) {
      var subtotal = 0;
      founduser.cart.forEach(function (data) {
        subtotal += parseInt(data.foodPrice * data.foodQuantity);
      });
      res.render("cart", { founduser, subtotal });
    });
});

router.get("/cart/inc/:id", isLoggedIn, function (req, res) {
  orderModel.findById(req.params.id).then(function (foundfood) {
    foundfood.foodQuantity += 1;
    foundfood.save();
    res.redirect("back");
  });
});

router.get("/cart/dec/:id", isLoggedIn, function (req, res) {
  userModel
    .findOne({ username: req.session.passport.user.username })
    .populate("cart")
    .then(function (founduser) {
      orderModel.findById(req.params.id).then(function (foundfood) {
        if (foundfood.foodQuantity > 1) {
          foundfood.foodQuantity -= 1;
          foundfood.save();
          res.redirect("back");
        } else {
          founduser.cart.remove(foundfood._id);
          founduser.save();
          res.redirect("back");
        }
      });
    });
});

router.get("/addToCart/:id", isLoggedIn, function (req, res) {
  userModel
    .findOne({ username: req.session.passport.user.username })
    .then(function (founduser) {
      orderModel.findOne({ _id: req.params.id }).then(function (foundpost) {
        founduser.cart.push(foundpost._id);
        founduser.save();
        res.redirect("/order");
      });
    });
});

router.get("/forgot", function (req, res) {
  res.render("forgot");
});

router.post(
  "/addfood",
  isLoggedIn,
  upload.single("foodImage"),
  function (req, res) {
    userModel
      .findOne({ username: req.session.passport.user.username })
      .then(function (data) {
        orderModel
          .create({
            foodName: req.body.foodName,
            foodPrice: req.body.foodPrice,
            foodTime: req.body.foodTime,
            foodRating: req.body.foodRating,
            foodImage: req.file.filename,
            foodOwner: data._id,
          })
          .then(function (addfood) {
            res.redirect("/order");
          });
      });
  }
);

router.post("/register", function (req, res) {
  var newUser = new userModel({
    username: req.body.username,
    name: req.body.name,
    number: req.body.number,
  });
  userModel.register(newUser, req.body.password).then(function (u) {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/order");
    });
  });
});
router.get("/googleregister", isLoggedIn, function (req, res) {
  userModel
    .findOne({
      username: req.session.passport.user._json.email,
    })
    .then(function (User) {
      if (User) {
        // console.log("phela pyyaar");
        req.logout(function (err) {});
        req.body.password = "password";
        req.body.username = User.username;
        passport.authenticate("local")(req, res, function () {
          res.redirect("/order");
        });
      } else {
        // console.log("dusraa pyyaar");
        const username = req.session.passport.user._json.email;
        const name = req.session.passport.user._json.given_name;
        req.logout(function (err) {
          var newUser = new userModel({
            username: username,
            name: name,
            number: "8959216542",
          });
          const password = "password";
          userModel.register(newUser, password).then(function (u) {
            passport.authenticate("local")(req, res, function () {
              res.redirect("/");
            });
          });
        });
      }
    });
});

router.get(
  "/google/auth",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/authenticated",
  passport.authenticate("google", {
    successRedirect: "/order",
    failureRedirect: "/",
  }),
  function (req, res) {}
);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/order",
    failureRedirect: "/",
  }),
  function (req, res, next) {}
);

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}
function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/order");
  } else {
    return next();
  }
}

module.exports = router;
