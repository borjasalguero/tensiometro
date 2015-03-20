// Load required packages
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('********** VAMOS a DESERIALIZAR!');
  done(null, user);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('************* isAuthenticated');
    console.log('username: ' + username);
    console.log('password: ' + password);


    // passport.deserializeUser(function(user, done) {
    //   console.log('********** VAMOS a DESERIALIZAR!');
    //   done(null, user);
    // });


    User.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      user.verifyPassword(password, function(err, isMatch) {
        if (err || !isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      });
    });
  }
));

exports.isAuthenticated = passport.authenticate('local', { session : true });



// exports.isAuthenticated = function() {

//   console.log('vamos que nos vamos');

//   passport.serializeUser(function(user, done) {
//     done(null, user);
//   });

//   passport.deserializeUser(function(user, done) {
//     console.log('********** VAMOS a DESERIALIZAR!');
//     done(null, user);
//   });




//   passport.use(new LocalStrategy(
//     function(username, password, done) {
//       console.log('************* isAuthenticated');
//       console.log('username: ' + username);
//       console.log('password: ' + password);


//       // passport.deserializeUser(function(user, done) {
//       //   console.log('********** VAMOS a DESERIALIZAR!');
//       //   done(null, user);
//       // });


//       User.findOne({ username: username }, function(err, user) {
//         if (err) {
//           return done(err);
//         }

//         if (!user) {
//           return done(null, false, { message: 'Incorrect username.' });
//         }

//         user.verifyPassword(password, function(err, isMatch) {
//           if (err || !isMatch) {
//             return done(null, false, { message: 'Incorrect password.' });
//           }

//           return done(null, user);
//         });
//       });
//     }
//   ));
// };
