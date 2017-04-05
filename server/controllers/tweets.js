var db = require('../../db');
var ObjectId = require('mongodb').ObjectId;
var _ = require('lodash');
var moment = require('moment');

exports.add_item = function(req, res) {

  if (db.get() == null) {
    return res.status(500).json({
      status: 'error',
      error: 'Database error'
    })
  } else if (!req.session.user) {
    return res.status(500).json({
      status: 'error',
      error: 'No logged in user'
    })
  }

  var collection = db.get().collection('tweets');
  collection.insert({
    content: req.body.content,
    parent: req.body.parent,
    username: req.session.user,
    timestamp: moment().unix()
  })
    .then(data => {
      return res.status(200).json({
        status: 'OK',
        id: data.ops[0]._id
      })
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        status: 'error',
        error: 'Failed to create tweet'
      })
    })
}

exports.get_item = function(req, res) {

  if (db.get() == null) {
    return res.status(500).json({
      status: 'error',
      error: 'Database error'
    })
  } else if (!req.session.user) {
    return res.status(500).json({
      status: 'error',
      error: 'No logged in user'
    })
  } else if (req.params.id.length != 24) {
    return res.status(500).json({
      status: 'error',
      error: 'Invalid ID: Must be a string 24 hex characters'
    })
  }

  var collection = db.get().collection('tweets');
  collection.findOne({
    _id: ObjectId(req.params.id)
  })
    .then(data => {
      var item = {
        id: data._id,
        username: data.username,
        content: data.content,
        timestamp: data.timestamp
      }
      return res.status(200).json({
        item: item,
        status: 'OK'
      })
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        status: 'error',
        error: 'Unable to find tweet'
      })
    })
}

// exports.search_items = function(req, res) {

//   if (db.get() == null) {
//     return res.status(500).json({
//       status: 'error',
//       error: 'Database error'
//     })
//   } else if (!req.session.user) {
//     return res.status(500).json({
//       status: 'error',
//       error: 'No logged in user'
//     })
//   }

//   var time = moment().unix();
//   var limit = 25;

//   if (req.body.timestamp) {
//     time = parseInt(req.body.timestamp);
//   }
//   if (req.body.limit) {
//     if (req.body.limit > 100) {
//       limit = 100;
//     } else {
//       limit = req.body.limit
//     }
//   }

//   // create a query object. if optional fields are present, add them to query object

//   var collection = db.get().collection('tweets');
//   collection.find({
//     timestamp: { $lte: time }
//   }).sort({timestamp: -1}).limit(limit).toArray()
//     .then(data => {
//       var items = [];
//       _.forEach(data, item => {
//         var result = {
//           id: item._id,
//           username: item.username,
//           content: item.content,
//           timestamp: item.timestamp
//         }
//         items.push(result);
//       })
//       return res.status(200).json({
//         status: 'OK',
//         items: items
//       })
//     })
//       .catch(err => {
//         console.log(err);
//         return res.status(500).json({
//           status: 'error',
//           error: 'Could not query for tweets'
//         })
//       })

// }


exports.search_items = function(req, res) {

  if (db.get() == null) {
    return res.status(500).json({
      status: 'error',
      error: 'Database error'
    })
  } else if (!req.session.user) {
    return res.status(500).json({
      status: 'error',
      error: 'No logged in user'
    })
  }

  var collection = db.get().collection('tweets');
  var sec_collection = db.get().collection('follows');

  var time = moment().unix();
  var limit = 25;
  var following = true;
  var follows = [];

  if (req.body.timestamp) {
    time = parseInt(req.body.timestamp);
  }
  if (req.body.limit) {
    if (req.body.limit > 100) {
      limit = 100;
    } else {
      limit = req.body.limit
    }
  }
  if (typeof req.body.following != undefined) {
    following = req.body.following;
  }

  // get list of users that current user is following
  if (following) {
    sec_collection.find({
      follower: req.session.user
    }).toArray()
      .then(follow_success => {
        _.forEach(follow_success, follow_user => {
          follows.push(follow_user.following);
        })

        // check if username is present in the request
        if (req.body.username) {
          // if username is present, check to see if it's inside the follow array.
          if (_indexOf(follows, req.body.username) == -1) {
            // username is not present in follow array so we should return 0 tweets;
            return res.status(200).json({
              status: 'OK',
              message: 'username not present in list of users being followed',
              items: []
            })
          }

          // user is present inside follow array. we only search for tweets associated with that user
          // check to see if query string exists

          if (req.body.q) {
            // query string exists
              collection.find({
                timestamp: { $lte: time },
                username: req.body.username,
                $text: { $search: req.body.q }
              }).sort({timestamp: -1}).limit(limit).toArray()
                .then(query_success => {
                  var items = [];
                  _.forEach(query_success, item => {
                    var result = {
                      id: item._id,
                      username: item.username,
                      content: item.content,
                      timestamp: item.timestamp
                    }
                    items.push(result);
                  })
                  return res.status(200).json({
                    status: 'OK',
                    message: 'Query success. Present fields: username, query, following',
                    items: items
                  })
                })
                .catch(query_fail => {
                  return res.status(500).json({
                    status: 'error',
                    error: 'Query failed. Present fields: username, query, following'
                  })
                })

          } else {
            // no need to search for query string
            collection.find({
              timestamp: { $lte: time },
              username: req.body.username
            }).sort({timestamp: -1}).limit(limit).toArray()
              .then(no_query_success => {
                var items = [];
                _.forEach(no_query_success, item => {
                  var result = {
                    id: item._id,
                    username: item.username,
                    content: item.content,
                    timestamp: item.timestamp
                  }
                  items.push(result);
                })
                return res.status(200).json({
                  status: 'OK',
                  message: 'Query success. Present fields: username, following',
                  items: items
                })
              })
              .catch(no_query_fail => {
                return res.status(500).json({
                  status: 'error',
                  error: 'Query failed. Present fields: username, following'
                })
              })
          }


        } else {
          // no username is present. we can now search for all tweets by users in follows array
          // check to see if query string exists

          if (req.body.q) {
            // query string exists
              collection.find({
                timestamp: { $lte: time },
                username: { $in: follows },
                $text: { $search: req.body.q }
              }).sort({timestamp: -1}).limit(limit).toArray()
                .then(query_success => {
                  var items = [];
                  _.forEach(query_success, item => {
                    var result = {
                      id: item._id,
                      username: item.username,
                      content: item.content,
                      timestamp: item.timestamp
                    }
                    items.push(result);
                  })
                  return res.status(200).json({
                    status: 'OK',
                    message: 'Query success. Present fields: query, following',
                    items: items
                  })
                })
                .catch(query_fail => {
                  return res.status(500).json({
                    status: 'error',
                    error: 'Query failed. Present fields: query, following'
                  })
                })

          } else {
            // no need to search for query string
            collection.find({
              timestamp: { $lte: time },
              username: { $in: follows }
            }).sort({timestamp: -1}).limit(limit).toArray()
              .then(no_query_success => {
                var items = [];
                _.forEach(no_query_success, item => {
                  var result = {
                    id: item._id,
                    username: item.username,
                    content: item.content,
                    timestamp: item.timestamp
                  }
                  items.push(result);
                })
                return res.status(200).json({
                  status: 'OK',
                  message: 'Query success. Present fields: following',
                  items: items
                })
              })
              .catch(no_query_fail => {
                return res.status(500).json({
                  status: 'error',
                  error: 'Query failed. Present fields: following'
                })
              })
          }

        }

      })
      .catch(follow_fail => {
        return res.status(500).json({
          status: 'error',
          error: 'Could not find users this user is following for tweet search'
        })
      })

  } else {
    // following is false so check if username is present in the request
    if (req.body.username) {
      // username is present in request. now we only query for tweets by user
      // check if query string is present
      if (req.body.q) {
        // query string is present
        collection.find({
          timestamp: { $lte: time },
          username: req.body.username,
          $text: { $search: req.body.q }
        }).sort({timestamp: -1}).limit(limit).toArray()
          .then(query_success => {
            var items = [];
            _.forEach(query_success, item => {
              var result = {
                id: item._id,
                username: item.username,
                content: item.content,
                timestamp: item.timestamp
              }
              items.push(result);
            })
            return res.status(200).json({
              status: 'OK',
              message: 'Query success. Present fields: username, query',
              items: items
            })
          })
          .catch(query_fail => {
            return res.status(500).json({
              status: 'error',
              error: 'Query failed. Present fields: username, query'
            })
          })

      } else {
        // query string is not present
        collection.find({
          timestamp: { $lte: time },
          username: req.body.username
        }).sort({timestamp: -1}).limit(limit).toArray()
          .then(query_success => {
            var items = [];
            _.forEach(query_success, item => {
              var result = {
                id: item._id,
                username: item.username,
                content: item.content,
                timestamp: item.timestamp
              }
              items.push(result);
            })
            return res.status(200).json({
              status: 'OK',
              message: 'Query success. Present fields: username',
              items: items
            })
          })
          .catch(query_fail => {
            return res.status(500).json({
              status: 'error',
              error: 'Query failed. Present fields: username'
            })
          })
      }


    } else {
      // username is not present in request. now we query for all tweets by any user
      // check if query string is present
      if (req.body.q) {
        // query string is present
        collection.find({
          timestamp: { $lte: time },
          $text: { $search: req.body.q }
        }).sort({timestamp: -1}).limit(limit).toArray()
          .then(query_success => {
            var items = [];
            _.forEach(query_success, item => {
              var result = {
                id: item._id,
                username: item.username,
                content: item.content,
                timestamp: item.timestamp
              }
              items.push(result);
            })
            return res.status(200).json({
              status: 'OK',
              message: 'Query success. Present fields: query',
              items: items
            })
          })
          .catch(query_fail => {
            return res.status(500).json({
              status: 'error',
              error: 'Query failed. Present fields: query'
            })
          })

      } else {
        // query string is not present
        collection.find({
          timestamp: { $lte: time }
        }).sort({timestamp: -1}).limit(limit).toArray()
          .then(query_success => {
            var items = [];
            _.forEach(query_success, item => {
              var result = {
                id: item._id,
                username: item.username,
                content: item.content,
                timestamp: item.timestamp
              }
              items.push(result);
            })
            return res.status(200).json({
              status: 'OK',
              message: 'Query success. Present fields: N/A',
              items: items
            })
          })
          .catch(query_fail => {
            return res.status(500).json({
              status: 'error',
              error: 'Query failed. Present fields: N/A'
            })
          })
      }

    }

  }

}

exports.delete_item = function(req, res) {

  if (db.get() == null) {
    return res.status(500).json({
      status: 'error',
      error: 'Database error'
    })
  } else if (!req.session.user) {
    return res.status(500).json({
      status: 'error',
      error: 'No logged in user'
    })
  } else if (req.params.id.length != 24) {
    return res.status(500).json({
      status: 'error',
      error: 'Invalid ID: Must be a string 24 hex characters'
    })
  }

  var collection = db.get().collection('tweets');
  collection.remove({
    _id: ObjectId(req.params.id),
    username: req.session.user
  })
    .then(data => {
      if (data.result.n == 0) {
        return res.status(500).json({
          status: 'error',
          error: 'tweet not found in database'
        })
      } else {
        return res.status(200).json({
          status: 'OK'
        })
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        status: 'error',
        error: 'Unable to delete tweet'
      })
    })
}
