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


// Nuestro mecanismo de comprobacion de contraseña estará
// en auth.js
var authController = require('./controller/auth.js');

// Los mecanismos de login son manejados a través de la librería
// "passport"
var passport = require('passport');

// Flash is needed in order to connect all errors given by passport
// when checking if a user/pass is valid, and passing them to the
// next request.
var flash = require('connect-flash');

// Needed as a connector for our DB in MongoDB
var mongoose = require('mongoose');

// Needed in order to avoid the Cross Domain or CORS
// ES NECESARIO???
var cors = require('cors');

// Let's use handlebars in our code
var exphbs  = require('express-handlebars');

// Required for exposing the paths properly *INVESTIGAR
var path = require('path');

// Declaramos nuestros puntos de entrada. Tenemos la
// API expuesta y la WEB basada en plantillas con Handlebar
var _web = require('./routers/web.js');
var _api = require('./routers/api.js');

// Let's create the app based on 'express'
var app = express();

// As we will deploy in Heroku or similar, we will get the
// port defined in the enviroment, or the 8080 by default
var port = process.env.PORT || 8080;
app.set('port', port);

// Settings for handlebars module
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
// TODO: EN PRODUCCION USAR LA CACHE.
// app.enable('view cache');

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'static')));


// Connect with the DB. As before, we need to connect it with
// the right ENV params, based on the platform to deploy.
app.db = mongoose.connect(process.env.MONGOLAB_URI);

// Passport does not directly manage your session, it only uses the session.
// So you configure session attributes (e.g. life of your session) via express
var sessionOpts = {
  saveUninitialized: true, // saved new sessions
  resave: false, // do not automatically write to the session store
  secret: 'SECRET', // TODO: Deberíamos de coger este valor de una variable de entorno
  cookie : { httpOnly: true, maxAge: 2419200000 } // configure when sessions expires
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// NOTA IMPORTANTE! Hay que establecer primero la sesion
// de express y después la sesion de passport
app.use(flash());
app.use(session(sessionOpts));
app.use(passport.initialize());
app.use(passport.session());

// COMPROBAR SI ES NECESARIO
// app.use(cors()); // Enable cors module

// Register routes!

// Expose the API in the right path
app.use('/api/v1', _api.getRouter());

// Expose the Webb-app in the root path
app.use('/', _web.getRouter());

// Añadimos este código para controlar el caso por defecto.
// Si intento acceder a dominio.es/LOQUESEA, redirijo apropiadamente
// al root, y este se encargará de hacer lo que deba (debe estar
// bien definido en "_web")
app.use(function(req, res){
  res.redirect('/');
});

// Arrancamos el router en el puerto deseado
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
