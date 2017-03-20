var MongoClient = require('mongodb').MongoClient;
var mongo_uri = 'mongodb://localhost:27017/tweety';
var db;

MongoClient.connect(mongo_uri, (err, database) => {
  if (err) {
    console.log("Error connecting to mongo");
    // console.log(err);
  } else {
    db = database;
    console.log("Connected to mongo");
  }
})

module.exports = db;