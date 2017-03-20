var express = require('express');
var app = express();
var bodyParser     = require('body-parser');
var session        = require('express-session');
var cookieParser   = require('cookie-parser');

var port = process.env.PORT || 80;

var db = require('./db');

app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(cookieParser());
app.use(session({resave: true, saveUninitialized: true, secret: 'supersecretfriedchicken', cookie: { maxAge: 60000 }}));

app.use('/static', express.static(__dirname + '/public')); // need this to read bundle.js
require('./server/routes')(app);

app.listen(port); 
console.log('\nServer hosted on port ' + port);
exports = module.exports = app;

