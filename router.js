const Authentication = require('./controllers/authentication');
console.log("here");

module.exports = function (app) {
  app.post('/signup', Authentication.signup);
}
