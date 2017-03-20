// var MongoClient = require('mongodb').MongoClient;
// var mongo_uri = 'mongodb://localhost:27017/tweety';
// var db;

// MongoClient.connect(mongo_uri, (err, database) => {
//   if (err) {
//     console.log("Error connecting to mongo");
//     // console.log(err);
//   } else {
//     db = database;
//     console.log("Connected to mongo");
//   }
// })

// module.exports = db;

var MongoClient = require('mongodb').MongoClient

var state = {
  db: null,
}

exports.connect = function(url, done) {
  if (state.db) return done()

  MongoClient.connect(url, function(err, db) {
    if (err) return done(err)
    state.db = db
    done()
  })
}

exports.get = function() {
  return state.db
}

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}