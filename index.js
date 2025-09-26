var express = require('express');
var router = express.Router();
const passport = require('passport')
const localStrategy = require("passport-local");
const userModel = require("./users")
// index.js
const app = require('./app');  // relative path to app.js

passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//AUTHENTICATION//
router.get('/profile', function(req, res, next) {
  res.send('welcome to profile');
});


// register route
router.post('/register', function (req, res) {
  var userdata = new userModel({
    username: req.body.username,
    secret: req.body.secret
  });

  userModel.register(userdata, req.body.password)
    .then(function (registereduser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect('/profile');
      });
    });
});
//login code
router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/"
}), function (req, res) { });
//logout code
app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}



module.exports = router;
