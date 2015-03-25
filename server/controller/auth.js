// Load required packages
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

var debug = false;

// Necesario para serializar la sesion. Si lo quito NO funciona
passport.serializeUser(function(user, done) {
  debug && console.log('Serializando USUARIO');
  done(null, user);
});
// Igual
passport.deserializeUser(function(user, done) {
  debug && console.log('DES-serializando USUARIO');
  done(null, user);
});
// En el caso de estar en un LOGIN, acudiremos a esta funcion
// para consultar en la BBDD si el usuario existe, y si las credenciales
// son válidas

// TODO Como modificar el mensaje de vuelta para que sea un JSON
passport.use(new LocalStrategy(
  function(username, password, done) {
    debug && console.log('username: ' + username);
    debug && console.log('password: ' + password);

    User.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }
      // Si no hay usuario dado el username....
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      // Si hay usuario, comparamos las contraseñas (convertidas)
      // a HASH
      user.verifyPassword(password, function(err, isMatch) {
        if (err || !isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      });
    });
  }
));

// Session está a TRUE ya que queremos usar sesiones. Si lo ponemos a FALSE
// necesitaremos añadir username/password en cada request
exports.isAuthenticated = passport.authenticate('local', { session : true });
