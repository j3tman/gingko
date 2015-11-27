var express = require('express');
var requestHandler = require('./../utils/requestHandler');

module.exports = function(passport, isLoggedIn) {
  var router = express.Router();

  router.get('/login', passport.authenticate('facebook', { scope: ['email', 'user_friends'] }));

  router.get('/login/callback', passport.authenticate('facebook', {failureRedirect: '/'}), function(req, res) {
    // res.redirect('/?' + req.user.dataValues.facebookId);
    res.redirect('/');
  });

  router.get('/logout', isLoggedIn, function(req, res) {
    req.logout();
    res.redirect('/');
  });

  router.get('/checkuser', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '');
  });

  return router;

};
