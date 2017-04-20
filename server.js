var express = require('express');
var app = express();
var bodyParser     = require('body-parser');
var session        = require('express-session');
var cookieParser   = require('cookie-parser');
var methodOverride = require('method-override');
var MongoStore = require('connect-mongo')(session);

var port = process.env.PORT || 80;

var db = require('./db');
// var mongo_uri = 'mongodb://localhost:27017/tweety';
var format = require('util').format;
var mongo_uri = format("mongodb://%s,%s,%s,%s/%s?replicaSet=%s&readPreference=%s",
  "192.168.1.21:27019",
  "192.168.1.13:27019",
  "192.168.1.19:27019",
  "192.168.1.20:27019",
  "tweety",
  "rs0",
  "secondaryPreferred");


db.connect(mongo_uri, function(err) {
  if (err) {
    console.log("Error connecting to mongo");
  } else {
    console.log("Connected to mongo");
  }
})


app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(cookieParser());
app.use(session({resave: true, 
                 saveUninitialized: true, 
                 secret: 'supersecretfriedchicken', 
                 cookie: { maxAge: 1000 * 60 * 60 * 2 },
                 store: new MongoStore({ url: mongo_uri })
               }));

app.use(methodOverride('X-HTTP-Method-Override'));
app.use('/static', express.static(__dirname + '/public')); // need this to read bundle.js
require('./server/routes')(app);

app.listen(port); 
console.log('\nServer hosted on port ' + port);
exports = module.exports = app;

