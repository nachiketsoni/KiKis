var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/res', function(req, res) {
  res.render('res');
});
router.get('/order', function(req, res) {
  res.render('order');
});

module.exports = router;
