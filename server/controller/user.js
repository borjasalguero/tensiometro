// Load required packages
var User = require('../models/user');

// Create endpoint /api/users for POST
exports.register = function(req, res) {
  console.log('Queremos registrar a:');
  console.log(req.body);




  // console.log('username: ' + req.body && req.body.username);
  // console.log('password: ' + req.body && req.body.password);
  var user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save(function(err) {
    if (err) {
      res.send(err);
    }

    res.json({ message: 'User registered properly' });
  });

  // res.send(req.body);
};


// Create endpoint /api/users for POST
exports.login = function(req, res) {
  // var user = new User({
  //   username: req.body.username,
  //   password: req.body.password
  // });

  // user.save(function(err) {
  //   if (err) {
  //     res.send(err);
  //   }

  //   res.json({ message: 'User registered properly' });
  // });
};

// Create endpoint /api/users for POST
exports.logout = function(req, res) {
  // var user = new User({
  //   username: req.body.username,
  //   password: req.body.password
  // });

  // user.save(function(err) {
  //   if (err) {
  //     res.send(err);
  //   }

  //   res.json({ message: 'User registered properly' });
  // });
};