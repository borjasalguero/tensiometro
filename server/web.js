// Main code of our server

// Needed for creating the server. We will specify the
// port and the server is running as expected!
var http = require('http');

// Library needed for adding request to the server. With this
// we can route POST/GET... requests to the right handler.
var express = require('express');

// We need to parse the params via form, using x-www-form-urlunencoded
var bodyParser = require('body-parser');

// Needed in order to keep a session
var session = require('express-session');

var passport = require('passport');
var authController = require('./controller/auth.js');

// Needed as a connector for our DB in MongoDB
var mongoose = require('mongoose');

// Needed in order to avoid the Cross Domain or CORS
var cors = require('cors');

// Needed as session handler.
var passport = require('passport');

// We need 2 identities: "dongles" and "content" shared
var userController = require('./controller/user.js');
// // var sampleManager = require('./models/sample.js');

// Let's create the app based on 'express'
var app = express();



// As we will deploy in Heroku or similar, we will get the
// port defined in the enviroment, or the 8080 by default
var port = process.env.PORT || 8080;
app.set('port', port);

// // console.log(process.env.MONGOLAB_URI);

// Connect with the DB. As before, we need to connect it with
// the right ENV params, based on the platform to deploy.
app.db = mongoose.connect(process.env.MONGOLAB_URI);



// // Use the body-parser package in our application.
// // NOTE! Before express 4.x, this could be declared directly as
// // app.use(express.bodyParser());
// app.use(bodyParser.urlencoded({
//   extended: true
// }));


// app.use(
//   session(
//     {
//       secret: process.env.COOKIEHASH || 'COOKIEHASH',
//       cookie: {
//         maxAge: 60000
//       }
//     }
//   )
// );


// app.use(cors()); // Enable cors module

// app.use(passport.initialize());
// app.use(passport.session());



// Passport does not directly manage your session, it only uses the session.
// So you configure session attributes (e.g. life of your session) via express
var sessionOpts = {
  saveUninitialized: true, // saved new sessions
  resave: false, // do not automatically write to the session store
  // store: sessionStore,
  secret: 'SECRET',
  cookie : { httpOnly: true, maxAge: 2419200000 } // configure when sessions expires
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
// app.use(cookieParser('SECRET'))
app.use(session(sessionOpts))

app.use(passport.initialize())
app.use(passport.session())



// Create our Express router
var router = express.Router();

router.all('*', function(req, res, next) {
  console.log('Aquí iría la funcion que comprueba la sesion');
  console.log('req.app ' + req.app);
  console.log('req.originalUrl ' + req.originalUrl);
  console.log('req.params ' + JSON.stringify(req.params));
  console.log('req.body ' + req.body);

  console.log('*******************************************');
  console.log('req.session ' + JSON.stringify(req.session));
  console.log('req.isAuthenticated ' + req.isAuthenticated());
  console.log('*******************************************');
  next();
});


router.route('/samples')
  .get(function(req, res, next) {
    if (req.isAuthenticated()) {
      console.log('ESTAS AUTENTICADO PREVIAMENTE');
      return next();
    } else {
      res.send('NO ESTAS AUTENTICADO');
    }
  }, function(req, res) {
    res.send('Desde GET /samples hemos funcionado bien');
  })
  .post(function(req, res, next) {
    if (req.isAuthenticated()) {
      console.log('ESTAS AUTENTICADO PREVIAMENTE');
      return next();
    } else {
      res.send('NO ESTAS AUTENTICADO');
    }
  }, function(req, res) {
    res.send('Desde POST /samples hemos funcionado bien');
  });

// router.route('/login')
//   .post(authController.isAuthenticated, function(req, res) {
//     if (req.isAuthenticated()) {
//       res.send('ESTAS AUTENTICADO');
//     } else {
//       res.send('NO ESTAS AUTENTICADO');
//     }

//   });


router.route('/login')
  .post(function(req, res, next) {
    if (req.isAuthenticated()) {
      res.send('ESTAS AUTENTICADO PREVIAMENTE');
    } else {
      console.log('NO ESTAS AUTENTICADO');
      return next();
    }
  }, authController.isAuthenticated, function(req, res) {
    if (req.isAuthenticated()) {
      res.send('AHORA ESTAS AUTENTICADO');
    } else {
      res.send('NO ESTAS AUTENTICADO');
    }

  });




router.route('/logout')
  .post(function(req, res) {
    req.session.destroy(function(err) {
      if (err) {
        res.send('Error when /logout :(');
      }
      req.session = null; // Deletes the cookie.
      res.session = null;
      res.send('/logout !!!!');

    })



  });

router.route('/register')
  .post(userController.register);

// Register all our routes with /api
app.use('/api/v1', router);


http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
