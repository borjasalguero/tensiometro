// Main code of our server

// Needed for creating the server. We will specify the
// port and the server is running as expected!
var http = require('http');
// Library needed for adding request to the server. With this
// we can route POST/GET... requests to the right handler.
var express = require('express');

// Needed as a connector for our DB in MongoDB
var mongoose = require('mongoose');

// Needed in order to avoid the Cross Domain or CORS
var cors = require('cors');

// // We need 2 identities: "dongles" and "content" shared
var userManager = require('./models/user.js');
// var sampleManager = require('./models/sample.js');

// Let's create the app based on 'express'
var app = express();
app.use(cors()); // Enable cors module
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());


// As we will deploy in Heroku or similar, we will get the
// port defined in the enviroment, or the 8080 by default
var port = process.env.PORT || 8080;
app.set('port', port);

console.log(process.env.MONGOLAB_URI);

// Connect with the DB. As before, we need to connect it with
// the right ENV params, based on the platform to deploy.
app.db = mongoose.connect(process.env.MONGOLAB_URI);

// Add the differents routes. When we request a GET/POST... from our
// client we want to route it to the right handler.

// Register the user.
app.post('/api/v1/user/register', userManager.register);
// Login.
// TODO login and register must keep a session.
app.post('/api/v1/user/login', userManager.login);
// Logout.
app.post('/api/v1/user/logout', userManager.logout);

// Post the sample to the server
app.post('/api/v1/:id/send', userManager.addSample);
// Get all samples. By default (if no param is included, will be the last week)
app.get('/api/v1/:id', userManager.getSamples);

// Boot server in the right port
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
