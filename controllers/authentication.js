const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timeStamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timeStamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // user has already had email and password authed
  // need to give token
  res.send({ token: tokenForUser(req.user) });

}

exports.signup = function (req, res, next) {
  // see if user with give email exists
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password'});
  }

  User.findOne({ email: email }, function(err, existingUser) {
    if(err) {
      return next(err);
    }
      // if user with email does exist, throw err
    if(existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    // if a user with email does NOT exist, create
    const user = new User({
        email: email,
        password: password
    });

    // save user
    user.save(function(err) {
      if(err) {
        return next(err);
      }
        // respond stating user was created
      res.json({ token: tokenForUser(user) });
    });
  });
}
