var db = require('../db');

module.exports = function(app) {

  var users = require('./controllers/users');
  var tweets = require('./controllers/tweets')

  var multer = require('multer');
  var upload = multer();

  app.post('/adduser', users.add_user);
  app.post('/verify', users.verify);
  app.post('/login', users.login);
  app.get('/logout', users.logout);
  app.post('/logout', users.logout);
  app.get('/auth', users.auth);

  app.get('/user/:username', users.get_user);
  app.post('/follow', users.follow);
  app.get('/user/:username/followers', users.get_followers);
  app.get('/user/:username/following', users.get_following);

  app.post('/additem', tweets.add_item);
  app.get('/item/:id', tweets.get_item);
  app.delete('/item/:id',tweets.delete_item);
  app.post('/search', tweets.new_search_items);

  app.post('/addmedia', tweets.add_media);
  app.get('/media/:id', tweets.get_media);

  app.get('*', function(req, res) {
    res.sendfile('./src/index.html');
  });

};