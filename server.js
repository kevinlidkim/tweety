var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');


var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');

// var routes = require('./src/routes');


var app = express();

var pathToApp = __dirname;

// app.use('/static', express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile(pathToApp + '/src/index.html');
});

// app.post('/yo', function(req, res) {
//   console.log("YOOO");
// })

app.get('/yo', function(req, res) {
  console.log("YOO");
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});