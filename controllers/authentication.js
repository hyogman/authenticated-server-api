const User = require('../models/user');

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
      res.json({ success: true} );
    });
  });
}
