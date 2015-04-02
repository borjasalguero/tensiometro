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
          // Vista que quiero rellenar
          // Estará dentro de 'views' como $NOMBRE.handlebars
          // Puedo inyectar esta vista dentro de un layout.
          'home',
          {
            // Layout donde podría inyectar la vista. Podría
            // ser un HTML con un header, y en {{body}}
            // inyectar diferentes vistas.
            layout: 'main',
            // A partir de ahora sólo parámetros, tanto del layout
            // como de la view
            title: 'AQUI VA EL TITULO',
            username: req.params.user_id
          }
        );
      }
    );

  router.route('/users/:user_id/samples')
    .get(
      isServerSessionAuthenticated,
      function(req, res) {
        res.render(
          // Vista que quiero rellenar
          // Estará dentro de 'views' como $NOMBRE.handlebars
          // Puedo inyectar esta vista dentro de un layout.
          'samples',
          {
            // Layout donde podría inyectar la vista. Podría
            // ser un HTML con un header, y en {{body}}
            // inyectar diferentes vistas.
            layout: 'main',
            // A partir de ahora sólo parámetros, tanto del layout
            // como de la view
            title: 'AQUI VA EL TITULO',
            username: req.params.user_id,
            samples: [
              {
                value: 1
              },
              {
                value: 2
              }
            ]
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
        res.render(
          // Vista que quiero rellenar
          // Estará dentro de 'views' como $NOMBRE.handlebars
          // Puedo inyectar esta vista dentro de un layout.
          'login'
          ,
          {
            appname: 'TensiometroApp',
            author: 'Powered by AUTHOR',
            error: req.flash('error')
          }
        );
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
          res.redirect('/login');
        }
      }
    );
  return router;
}
