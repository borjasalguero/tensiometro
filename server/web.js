// Main code of our server

// Needed for creating the server. We will specify the
// port and the server is running as expected!
var http = require('http');

// Library needed for adding request to the server. With this
// we can route POST/GET... requests to the right handler.
var express = require('express');

// We need to parse the params via form, using x-www-form-urlunencoded
// Ahora estas librerías se cargan por separado desde express > 4.x
var bodyParser = require('body-parser');

// Needed in order to keep a session
// Ahora estas librerías se cargan por separado desde express > 4.x
var session = require('express-session');

// Los mecanismos de login son manejados a través de la librería
// "passport"
var passport = require('passport');

// Nuestro mecanismo de comprobacion de contraseña estará
// en auth.js
var authController = require('./controller/auth.js');

// Needed as a connector for our DB in MongoDB
var mongoose = require('mongoose');

// Needed in order to avoid the Cross Domain or CORS
// ES NECESARIO???
var cors = require('cors');



// Creamos nuestras identidades
var userController = require('./controller/user.js');
// SAMPLE: Hay que descomentar esto cuando esté listo
// // var sampleManager = require('./models/sample.js');






// Let's create the app based on 'express'
var app = express();

// As we will deploy in Heroku or similar, we will get the
// port defined in the enviroment, or the 8080 by default
var port = process.env.PORT || 8080;
app.set('port', port);

// Connect with the DB. As before, we need to connect it with
// the right ENV params, based on the platform to deploy.
app.db = mongoose.connect(process.env.MONGOLAB_URI);

// Passport does not directly manage your session, it only uses the session.
// So you configure session attributes (e.g. life of your session) via express
var sessionOpts = {
  saveUninitialized: true, // saved new sessions
  resave: false, // do not automatically write to the session store
  secret: 'SECRET',
  cookie : { httpOnly: true, maxAge: 2419200000 } // configure when sessions expires
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// NOTA IMPORTANTE! Hay que establecer primero la sesion
// de express y después la sesion de passport
app.use(session(sessionOpts));
app.use(passport.initialize());
app.use(passport.session());

// COMPROBAR SI ES NECESARIO
// app.use(cors()); // Enable cors module


// Create our Express router. Está genial ya que podemos
// redirigir nuestras peticiones tomando una base diferente
// Ahora usamos /api/v1, pero si esto queremos que se modifique
// en el futuro se puede hacer sólo modificando una línea.

var router = express.Router();

router.all('*', function(req, res, next) {
  // Por cada petición imprimo su info.
  console.log('*******************************************');
  console.log('req.app ' + req.app);
  console.log('req.originalUrl ' + req.originalUrl);
  console.log('req.params ' + JSON.stringify(req.params));
  console.log('req.body ' + req.body);
  console.log('req.session ' + JSON.stringify(req.session));
  console.log('req.isAuthenticated ' + req.isAuthenticated());
  console.log('*******************************************');
  next();
});

// - ¿Tenemos una sesion?
// - NO: Devolvemos al cliente una nota para que muestre el /login
// o lo hacemos con templates aquí si finalmente tomamos esta decision
// - SI: Permitimos ejecutar la consulta moviendonos al siguiente paso
function isSessionAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('ESTAS AUTENTICADO PREVIAMENTE');
    return next();
  } else {
    res.send('NO ESTAS AUTENTICADO');
  }
}

router.route('/samples')
  .get(
    isSessionAuthenticated,
    function(req, res) {
      res.send('GET SAMPLES de ' + req.session);
    }
  )
  .post(
    isSessionAuthenticated,
    function(req, res) {
      res.send('POST SAMPLES de ' + req.session.passport.user.username);
    }
  );

function isNotSessionAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.send('ESTAS AUTENTICADO PREVIAMENTE');
  } else {
    console.log('NO ESTAS AUTENTICADO');
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
    function(req, res) {
    if (req.isAuthenticated()) {
      res.send('AHORA ESTAS AUTENTICADO');
    } else {
      res.send('NO ESTAS AUTENTICADO');
    }
  });


router.route('/logout')
  .post(
    // Compruebo si no hay una sesion y, por lo tanto,
    // no es necesario logout
    isSessionAuthenticated,
    // Si está registrado, procedemos al logout
    function(req, res) {
      req.session.destroy(function(err) {
        if (err) {
          res.send('Error when /logout :(');
        }
        req.session = null; // Deletes the cookie.
        res.session = null;
        res.send('LOGOUT con éxito');
      });
    }
  );

router.route('/register')
  .post(userController.register);

// Register all our routes with /api
app.use('/api/v1', router);


http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
