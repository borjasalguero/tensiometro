// Load required packages
var User = require('../models/user');

var errors = require('../errors/api.js');

// Create endpoint /api/users for POST
exports.register = function(req, res) {
  if (!req.body.username ||
      !req.body.password) {
    res.json(errors['register_params']);
    return;
  }

  var user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save(function(err) {
    if (err) {
      res.json(errors['username_already_used']);
      return;
    }

    res.json(
      {
        registered: true
      }
    );
  });
};


// Create endpoint /api/users for POST
exports.login = function(req, res) {
  res.json(
    {
      authenticated:  req.isAuthenticated()
    }
  );
};

// Create endpoint /api/users for POST
exports.logout = function(req, res, next) {
  req.session.destroy(function(err) {
    if (err) {
      res.json(errors['logout_error']);
      return;
    }
    req.session = null;
    next();
  });
};