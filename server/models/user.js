var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: String,
  password: String,
  uuid : { type: Number, default: 1 }, //
  created: { type: Date, default: Date.now() },
  samples: []
});

var UserModel = mongoose.model('User', UserSchema);

var UserManager = {
  // Register a dongle given endpoint and alias. If alias is not
  // defined maybe we shold add a custom one.
  register: function(req, res) {
    console.log('Lets store the item ' + JSON.stringify(req.body));
    var user = new UserModel(req.body);
    user.save(function(e, dongleCreated) {
      if(e) {
        // Creamos la sesión
        return res.send(500, err.message);
      }
      res.status(200).jsonp(dongleCreated);
    });
  },
  login: function(req, res) {

  },
  logout: function(req, res) {

  },
  addSample: function(req, res) {

  },
  getSamples: function(req, res) {

  }
  // notify: function(id, callback) {
  //   // DongleModel.find(
  //   //   {
  //   //     _id: id
  //   //   },
  //   //   function(e, result) {

  //   //     if (e) {
  //   //       callback(e);
  //   //       return;
  //   //     }
  //   //     var dongle = result[0];

  //   //     if (!dongle || !dongle.pushversion) {
  //   //       callback({
  //   //         message: 'Dongle ' + id + 'does not exists'
  //   //       });
  //   //       return;
  //   //     }
  //   //     dongle.pushversion++;
  //   //     dongle.save(function(e, user) {
  //   //       if (e) {
  //   //         callback(e);
  //   //         return;
  //   //       }
  //   //       console.log('Send push to ' + dongle.endpoint);
  //   //       console.log('With version ' + dongle.pushversion);
  //   //       simplePush.notify(dongle.pushversion, dongle.endpoint);
  //   //       callback();
  //   //     });
  //   //   }
  //   // );
  // }
};

module.exports = UserManager;
