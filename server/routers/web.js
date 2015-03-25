// Library needed for adding request to the server. With this
// we can route POST/GET... requests to the right handler.
var express = require('express');



// Nuestro mecanismo de comprobacion de contraseña estará
// en auth.js
var authController = require('../controller/auth.js');
// Creamos nuestras identidades
var userController = require('../controller/user.js');

function isServerSessionAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}

function isNotServerSessionAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/users/' + req.session.passport.user.username);
  } else {
    return next();
  }
}


exports.getRouter = function() {
  var router = express.Router();
  router.route('/')
    .get(
      isServerSessionAuthenticated,
      function(req, res) {
        res.redirect('/login');
      }
    );

  router.route('/users/:user_id')
    .get(
      isServerSessionAuthenticated,
      function(req, res) {
        res.render(
          'samples', // Template/Vista que quiero rellenar
          {
            // layout: 'landing', // Layout dónde podría inyectar la vista
            // A partir de ahora sólo parámetros
            title: req.params.user_id
          }
        );
      }
    );

  router.route('/register')
    .get(
      isNotServerSessionAuthenticated,
      function(req, res) {
        res.send('FORMULARIO DE REGISTER');
      }
    );

  router.route('/logout')
    .get(
        // Compruebo si no hay una sesion y, por lo tanto,
        // no es necesario logout
        isServerSessionAuthenticated,
        // Si está registrado, procedemos al logout
        userController.logout,
        function(req, res) {
          res.redirect('/');
        }
    );

  router.route('/login')
    .get(
      isNotServerSessionAuthenticated,
      function(req, res) {
        res.send('FORMULARIO LOGIN');
      }
    )
    .post(
      isNotServerSessionAuthenticated,
       // Si no hay sesion, compruebo si username y password
      // están registrados
      authController.isAuthenticated,
      // Si no están registrados, tendremos que llevarle
      // a una página de error o de sign up
      function(req, res) {
        if (req.isAuthenticated()) {
          res.redirect('/users/' + req.session.passport.user.username);
        } else {

        }
      }
    );
  return router;
}
