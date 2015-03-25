// Load required packages
var User = require('../models/user');

// Create endpoint /api/users for POST
exports.register = function(req, res) {
  if (!req.body.username ||
      !req.body.password) {
    res.json(
      {
        code: 101,
        message: 'Error: Username/Password are not defined properly'
      }
    );
    return;
  }

  var user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save(function(err) {
    if (err) {
      res.json(
        {
          code: 102,
          message: 'Error: Username is already used'
        }
      );
      return;
    }

    res.json(
      {
        message: 'User registered properly'
      }
    );
  });
};


// Create endpoint /api/users for POST
exports.login = function(req, res) {
  if (req.isAuthenticated()) {
    res.send('AHORA ESTAS AUTENTICADO');
  } else {
    res.send('NO ESTAS AUTENTICADO');
  }
};

// Create endpoint /api/users for POST
exports.logout = function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      res.send('Error when /logout :(');
    }
    req.session = null;
    res.send('LOGOUT con éxito');
  });
};