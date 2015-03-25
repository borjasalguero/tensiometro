// Library needed for adding request to the server. With this
// we can route POST/GET... requests to the right handler.
var express = require('express');

// Nuestro mecanismo de comprobacion de contraseña estará
// en auth.js
// Los mecanismos de 'serialización' y 'desserialización' de
// la sesion también se incluirán en este fichero
var authController = require('../controller/auth.js');

// Controlador que manejará todos los métodos relacionados
// con el usuario (register, login, logout...)
var userController = require('../controller/user.js');

// Centralizamos todos los errores de la API en un solo lugar
var errors = require('../errors/api.js');

var debug = false;

exports.getRouter = function() {
  // Creamos nuestro 'router'. Está genial ya que podemos
  // redirigir nuestras peticiones tomando una base diferente
  // Ahora usamos "/api/v1", pero si esto queremos cambiarlo
  // en el futuro se puede hacer sólo modificando una línea.
  var router = express.Router();

  router.all('*', function(req, res, next) {
    if (debug) {
      // Por cada petición imprimo su info.
      console.log('*******************************************');
      console.log('req.app ' + req.app);
      console.log('req.originalUrl ' + req.originalUrl);
      console.log('req.params ' + JSON.stringify(req.params));
      console.log('req.body ' + req.body);
      console.log('req.session ' + JSON.stringify(req.session));
      console.log('req.isAuthenticated ' + req.isAuthenticated());
      console.log('*******************************************');
    }

    next();
  });

  // - ¿Tenemos una sesion?
  // - NO: Devolvemos al cliente una nota para que muestre el /login
  // o lo hacemos con templates aquí si finalmente tomamos esta decision
  // - SI: Permitimos ejecutar la consulta moviendonos al siguiente paso
  function isSessionAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.json(errors['user_not_authenticated']);
    }
  }

  router.route('/samples')
    .get(
      isSessionAuthenticated,
      function(req, res) {
        // TODO Aquí iría la peticion a la BBDD y la recuperación
        // de las muestras.
        res.send('GET SAMPLES de ' + req.session);
      }
    )
    .post(
      isSessionAuthenticated,
      function(req, res) {
        // TODO Aquí iría el añadir la muestra a la BBDD
        res.send('POST SAMPLES de ' + req.session.passport.user.username);
      }
    );

  function isNotSessionAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      // TODO Check if this is just we need.
      res.json(
        {
          authenticated: true
        }
      );
    } else {
      return next();
    }
  }

  router.route('/login')
    .post(
      // Compruebo si hay una sesion y, por lo tanto,
      // no es necesario login
      isNotSessionAuthenticated,
      // Si no hay sesion, compruebo si username y password
      // están registrados
      authController.isAuthenticated,
      // Si no están registrados, tendremos que llevarle
      // a una página de error o de sign up
      userController.login
    );

  router.route('/logout')
    .post(
      // Compruebo si no hay una sesion y, por lo tanto,
      // no es necesario logout
      isSessionAuthenticated,
      // Si está registrado, procedemos al logout
      userController.logout,
      function(req, res) {
        res.json(
          {
            logout: true
          }
        );
      }
    );

  router.route('/register')
    .post(
      // Compruebo si hay una sesion y, por lo tanto,
      // no es necesario el register
      isNotSessionAuthenticated,
      // Si no hay sesion, compruebo si username y password
      // están registrados
      userController.register
    );

  return router;
}
