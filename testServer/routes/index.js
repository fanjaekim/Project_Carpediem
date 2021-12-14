var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.redirect("user/login"); //move to login homepage
  //res.render("user/signup");
});

module.exports = router;
