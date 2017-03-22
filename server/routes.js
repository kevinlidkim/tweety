var db = require('../db');

module.exports = function(app) {

  var users = require('./controllers/users');

  app.post('/adduser', users.add_user);
  app.post('/verify', users.verify);
  app.post('/login', users.login);
  app.get('/logout', users.logout);
  app.post('/logout', users.logout);
  app.get('/auth', users.auth);

  app.post('/additem', users.add_item);
  app.get('/item/:id', users.get_item);
  app.post('/search', users.search_items);

  app.get('*', function(req, res) {
    res.sendfile('./src/index.html');
  });

};