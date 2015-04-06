// Load required packages
var Sample = require('../models/sample');


// Create endpoint /api/users for POST
exports.create = function(req, res, next) {
  console.log('Vamos a crear esto del tiron cabessa');
  var sample = new Sample({
    owner: req.session.passport.user._id,
    sistolic: req.body.sistolic,
    diastolic: req.body.diastolic,
    rpm: req.body.rpm
  });

  sample.save(function(err) {
    if (err) {
      console.log('ERRRORR EN EL CONTROLLER');
      next(err);
      return;
    }
    console.log('GUARDADO EN EL CONTROLLER');
    next();
  });
};

// Get all samples given a user
exports.get = function(req, callback) {
  var query = {
    owner: req.session.passport.user._id
  };

  Sample.find(
    query,
    function(e, items) {
      callback(items || [])
    }
  );
};