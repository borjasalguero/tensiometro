// Load required packages
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

var debug = true;

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
    debug && console.log('******** Comprobamos los datos de Login *********');
    debug && console.log('username: ' + username);
    debug && console.log('password: ' + password);
    User.findOne({ username: username }, function(err, user) {
      debug && console.log('err ' + err);
      debug && console.log('user ' + user);
      if (err) {
        return done(err);
      }
      // Si no hay usuario dado el username....
      if (!user) {
        console.log('***** NO HAY USUARIO DADO EL USERNAME');
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

exports.isAuthenticated =  function (req, res, next) {
  passport.authenticate(
    'local', // Usamos passport "local"
    {
      // Podemos deshabilitar la sesion poniendo a 'false'
      session: true
    },
    function(err, user, info) {
      if (err) {
        return next(err)
      }
      if (!user) {
        req.flash('error', info.message);
        return next();
      }
      // Registramos al usuario si todo fue bien
      req.logIn(
        user,
        function(err) {
          if (err) {
            return next(err);
          }
          return next();
        }
      );
    }
  )(req, res, next);
}





