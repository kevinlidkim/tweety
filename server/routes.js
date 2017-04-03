var db = require('../db');

module.exports = function(app) {

  var users = require('./controllers/users');
  var tweets = require('./controllers/tweets')

  app.post('/adduser', users.add_user_email);
  app.post('/verify', users.verify);
  app.post('/login', users.login);
  app.get('/logout', users.logout);
  app.post('/logout', users.logout);
  app.get('/auth', users.auth);

  app.post('/additem', tweets.add_item);
  app.get('/item/:id', tweets.get_item);
  app.delete('/item/:id',tweets.delete_item);
  app.post('/search', tweets.search_items);

  app.get('*', function(req, res) {
    res.sendfile('./src/index.html');
  });

};