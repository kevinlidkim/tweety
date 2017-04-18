var db = require('../../db');
var ObjectId = require('mongodb').ObjectId;
var _ = require('lodash');
var moment = require('moment');

var cassandra = require('cassandra-driver');
var client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'tweety' });

var multer = require('multer');
var upload = multer().single('content');
var fs = require('fs');

var shortid = require('shortid');
var fileType = require('file-type');

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
    timestamp: moment().unix(),
    media: req.body.media
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
      if (data) {
        data.id = data._id;
        return res.status(200).json({
          item: data,
          status: 'OK'
        })
      } else {
        return res.status(500).json({
          status: 'error',
          error: 'Unable to find tweet by id'
        })
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        status: 'error',
        error: 'Error trying to find tweet'
      })
    })
}


exports.search_items = function(req, res) {

  var start = moment();

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
  if (req.body.following != undefined) {
    following = req.body.following;
  }

  if (following) {
    // following
    if (req.body.username) {
      // following + username
      sec_collection.findOne({
        follower: req.session.user,
        following: req.body.username
      })
        .then(relationship => {
          if (req.body.q) {
            // following + username + query string
            collection.find({
                timestamp: { $lte: time },
                username: req.body.username,
                $text: { $search: req.body.q }
              }).sort({timestamp: -1}).limit(limit).toArray()
                .then(query_success => {
                  _.forEach(query_success, item => {
                    item.id = item._id
                  })
                  var end = moment();
                  var diff = end.diff(start);
                  var time_diff = {
                    start: start,
                    end: end,
                    diff: diff
                  }
                  console.log(diff + "              Present fields: username, query, following");
                  return res.status(200).json({
                    time_diff: time_diff,
                    status: 'OK',
                    message: 'Query success. Present fields: username, query, following',
                    items: query_success
                  })
                })
                .catch(query_fail => {
                  console.log(query_fail);
                  return res.status(500).json({
                    status: 'error',
                    error: 'Query failed. Present fields: username, query, following'
                  })
                })
          } else {
            // following + username + no query string
            collection.find({
              timestamp: { $lte: time },
              username: req.body.username
            }).sort({timestamp: -1}).limit(limit).toArray()
              .then(no_query_success => {
                _.forEach(no_query_success, item => {
                  item.id = item._id
                })
                var end = moment();
                var diff = end.diff(start);
                var time_diff = {
                  start: start,
                  end: end,
                  diff: diff
                }
                console.log(diff + "              Present fields: username, following");
                return res.status(200).json({
                  time_diff: time_diff,
                  status: 'OK',
                  message: 'Query success. Present fields: username, following',
                  items: no_query_success
                })
              })
              .catch(no_query_fail => {
                console.log(no_query_fail);
                return res.status(500).json({
                  status: 'error',
                  error: 'Query failed. Present fields: username, following'
                })
              })
          }
        })
        .catch(relationship_fail => {
          return res.status(200).json({
            status: 'OK',
            message: 'username not being followed',
            items: []
          })
        })
    } else {
      // following + no username
      sec_collection.find({
        follower: req.session.user
      }).toArray()
        .then(follow_success => {
          _.forEach(follow_success, follow_user => {
            follows.push(follow_user.following);
          })

          if (req.body.q) {
            // following + no username + query string
            collection.find({
              timestamp: { $lte: time },
              username: { $in: follows },
              $text: { $search: req.body.q }
            }).sort({timestamp: -1}).limit(limit).toArray()
              .then(query_success => {
                _.forEach(query_success, item => {
                  item.id = item._id
                })
                var end = moment();
                var diff = end.diff(start);
                var time_diff = {
                  start: start,
                  end: end,
                  diff: diff
                }
                console.log(diff + "              Present fields: query, following");
                return res.status(200).json({
                  time_diff: time_diff,
                  status: 'OK',
                  message: 'Query success. Present fields: query, following',
                  items: query_success
                })
              })
              .catch(query_fail => {
                console.log(query_fail);
                return res.status(500).json({
                  status: 'error',
                  error: 'Query failed. Present fields: query, following'
                })
              })
          } else {
            // following + no username + no query string
            collection.find({
              timestamp: { $lte: time },
              username: { $in: follows }
            }).sort({timestamp: -1}).limit(limit).toArray()
              .then(no_query_success => {
                _.forEach(no_query_success, item => {
                  item.id = item._id
                })
                var end = moment();
                var diff = end.diff(start);
                var time_diff = {
                  start: start,
                  end: end,
                  diff: diff
                }
                console.log(diff + "              Present fields: following");
                return res.status(200).json({
                  time_diff: time_diff,
                  status: 'OK',
                  message: 'Query success. Present fields: following',
                  items: no_query_success
                })
              })
              .catch(no_query_fail => {
                console.log(no_query_fail);
                return res.status(500).json({
                  status: 'error',
                  error: 'Query failed. Present fields: following'
                })
              })
          }

        })
        .catch(follow_fail => {
          console.log(follow_fail);
          return res.status(500).json({
            status: 'error',
            error: 'Could not find users that this user is following for tweet search'
          })
        })
    }
  } else {
    // not following
    if (req.body.username) {
      // not following + username
      if (req.body.q) {
        // not following + username + query string
        collection.find({
          timestamp: { $lte: time },
          username: req.body.username,
          $text: { $search: req.body.q }
        }).sort({timestamp: -1}).limit(limit).toArray()
          .then(query_success => {
            _.forEach(query_success, item => {
              item.id = item._id
            })
            var end = moment();
            var diff = end.diff(start);
            var time_diff = {
              start: start,
              end: end,
              diff: diff
            }
            console.log(diff + "              Present fields: username, query");
            return res.status(200).json({
              time_diff: time_diff,
              status: 'OK',
              message: 'Query success. Present fields: username, query',
              items: query_success
            })
          })
          .catch(query_fail => {
            console.log(query_fail);
            return res.status(500).json({
              status: 'error',
              error: 'Query failed. Present fields: username, query'
            })
          })
      } else {
        // not following + username + no query string
        collection.find({
          timestamp: { $lte: time },
          username: req.body.username
        }).sort({timestamp: -1}).limit(limit).toArray()
          .then(query_success => {
            _.forEach(query_success, item => {
              item.id = item._id
            })
            var end = moment();
            var diff = end.diff(start);
            var time_diff = {
              start: start,
              end: end,
              diff: diff
            }
            console.log(diff + "              Present fields: username");
            return res.status(200).json({
              time_diff: time_diff,
              status: 'OK',
              message: 'Query success. Present fields: username',
              items: query_success
            })
          })
          .catch(query_fail => {
            console.log(query_fail);
            return res.status(500).json({
              status: 'error',
              error: 'Query failed. Present fields: username'
            })
          })
      }
    } else {
      // not following + no username
      if (req.body.q) {
        // not following + no username + query string
        collection.find({
          timestamp: { $lte: time },
          $text: { $search: req.body.q }
        }).sort({timestamp: -1}).limit(limit).toArray()
          .then(query_success => {
            _.forEach(query_success, item => {
              item.id = item._id
            })
            var end = moment();
            var diff = end.diff(start);
            var time_diff = {
              start: start,
              end: end,
              diff: diff
            }
            console.log(diff + "              Present fields: query");
            return res.status(200).json({
              time_diff: time_diff,
              status: 'OK',
              message: 'Query success. Present fields: query',
              items: query_success
            })
          })
          .catch(query_fail => {
            console.log(query_fail);
            return res.status(500).json({
              status: 'error',
              error: 'Query failed. Present fields: query'
            })
          })
      } else {
        // not following + no username + no query string
        collection.find({
          timestamp: { $lte: time }
        }).sort({timestamp: -1}).limit(limit).toArray()
          .then(query_success => {
            _.forEach(query_success, item => {
              item.id = item._id
            })
            var end = moment();
            var diff = end.diff(start);
            var time_diff = {
              start: start,
              end: end,
              diff: diff
            }
            console.log(diff + "              Present fields: N/A");
            return res.status(200).json({
              time_diff: time_diff,
              status: 'OK',
              message: 'Query success. Present fields: N/A',
              items: query_success
            })
          })
          .catch(query_fail => {
            console.log(query_fail);
            return res.status(500).json({
              status: 'error',
              error: 'Query failed. Present fields: N/A'
            })
          })
      }
    }
  }

}

// exports.delete_item = function(req, res) {

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
//   } else if (req.params.id.length != 24) {
//     return res.status(500).json({
//       status: 'error',
//       error: 'Invalid ID: Must be a string 24 hex characters'
//     })
//   }

//   var collection = db.get().collection('tweets');

//   collection.findOne({
//     _id: ObjectId(req.params.id)
//   })
//     .then(tweet => {
//       if (tweet) {
//         var query = 'DELETE FROM media WHERE file_id = ?';
//         client.execute(query, [tweet.media[0]], function(err, result) {
//           if (err) {
//             console.log(err);
//             return res.status(500).json({
//               status: 'error',
//               error: "Couldn't delete associated media file"
//             })
//           } else {
//             collection.remove({
//               _id: ObjectId(req.params.id)
//             })
//               .then(tweet_removed => {
//                 if (tweet_removed.result.n == 0) {
//                   return res.status(500).json({
//                     status: 'error',
//                     message: 'Tweet already does not exist in database'
//                   })
//                 } else {
//                   return res.status(200).json({
//                     status: 'OK',
//                     message: 'Successfully deleted tweet and associated media files'
//                   })
//                 }
//               })
//               .catch(tweet_removed_fail => {
//                 console.log(tweet_removed_fail);
//                 return res.status(500).json({
//                   status: 'error',
//                   error: 'Failed to delete tweet'
//                 })
//               })
//           }
//         })
//       } else {
//         return res.status(500).json({
//           status: 'error',
//           error: 'tweet not found in database'
//         })
//       }
//     })
//     .catch(err => {
//       console.log(err);
//       return res.status(500).json({
//         status: 'error',
//         error: 'Unable to find tweet to delete'
//       })
//     })

// }

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

  collection.findOneAndDelete({
    _id: ObjectId(req.params.id)
  })
    .then(tweet => {
      if (tweet.lastErrorObject.n > 0) {
        if (tweet.value.media && tweet.value.media.length > 0) {
          var query = 'DELETE FROM media WHERE file_id = ?';
          client.execute(query, [tweet.media[0]], function(err, result) {
            if (err) {
              console.log(err);
              return res.status(500).json({
                status: 'error',
                error: 'Unable to delete associated media file'
              })
            } else {
              return res.status(200).json({
                status: 'OK',
                message: 'Successfully deleted tweet and associated media file'
              })
            }
          })
        } else {
          return res.status(200).json({
            status: 'OK',
            message: 'Successfully deleted tweet'
          })
        }
      } else {
        return res.status(500).json({
          status: 'error',
          error: "Tweet doesn't exist"
        })
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        status: 'error',
        error: 'Unable to find tweet to delete'
      })
    })

}

exports.likes = function(req, res) {
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
  var sec_collection = db.get().collection('likes');
  collection.findOne({
    _id: ObjectId(req.params.id)
  })
    .then(tweet => {
      // if tweet exists, then we can proceed
      if (tweet) {
        // check to see if we are liking or unliking
        if (req.body.like) {
          // check to see if relationship exists or not
          sec_collection.findOne({
            user: req.session.user,
            tweet: ObjectId(req.params.id)
          })
            .then(relationship => {
              // relationship already exists
              if (relationship) {
                return res.status(500).json({
                  status: 'error',
                  error: 'Already liked tweet'
                })
              } else {
                sec_collection.insert({
                  user: req.session.user,
                  tweet: ObjectId(req.params.id)
                })
                  .then(like_success => {
                    return res.status(200).json({
                      status: 'OK',
                      message: 'Successfully liked tweet'
                    })
                  })
                  .catch(like_fail => {
                    return res.status(500).json({
                      status: 'error',
                      error: 'Failed to create like relationship'
                    })
                  })
              }
            })
            .catch(relationship_err => {
              return res.status(500).json({
                status: 'error',
                error: "Error querying like relationship"
              })
            })
        } else {
          // we are unliking in this case
          sec_collection.findOne({
            user: req.session.user,
            tweet: ObjectId(req.params.id)
          })
            .then(unlike_relationship => {
              // relationship exists
              if (unlike_relationship) {
                sec_collection.remove({
                  user: req.session.user,
                  tweet: ObjectId(req.params.id)
                })
                  .then(unlike_success => {
                    return res.status(200).json({
                      status: 'OK',
                      message: 'Successfully unliked tweet'
                    })
                  })
                  .catch(unlike_fail => {
                    return res.status(500).json({
                      status: 'error',
                      error: 'Failed to delete like relationship'
                    })
                  })
              } else {
                return res.status(500).json({
                  status: 'error',
                  error: 'User already does not like tweet'
                })
              }
            })
        }
      } else {
        return res.status(500).json({
          status: 'error',
          error: "Couldn't find tweet to like"
        })
      }
    })
    .catch(err => {
      return res.status(500).json({
        status: 'error',
        error: "Error finding tweet to like"
      })
    })

}

exports.add_media = function(req, res) {

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
  } else if (client == null) {
    return res.status(500).json({
      status: 'error',
      error: 'Cassandra error'
    })
  }

  upload(req, res, function(err) {
    if (err) {
      console.log(err);
      return res.status(404).json({
        status: 'Failed to upload file'
      })
    } else {
      var file_id = shortid.generate();

      // console.log('DEPOSITING FILE ' + file_id);
      // console.log('================');
      // console.log('');
      // console.log(req.file);
      // console.log('');

      var query = 'INSERT INTO media (file_id, content, mimetype) VALUES (?, ?, ?)';

      client.execute(query, [file_id, req.file.buffer, req.file.mimetype], function(err, result) {
        if (err) {
          console.log(err);
          return res.status(404).json({
            status: 'error',
            error: "Couldn't deposit file"
          })
        } else {
          return res.status(200).json({
            status: 'OK',
            message: 'Successfully deposited file',
            id: file_id
          })
        }
      })
    }
  })

}

exports.get_media = function(req, res) {
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
  } else if (client == null) {
    return res.status(500).json({
      status: 'error',
      error: 'Cassandra error'
    })
  } else if (!req.params.id) {
    return res.status(500).json({
      status: 'error',
      error: 'Invalid media id'
    })
  }

  var file_id = req.params.id;
  var query = 'SELECT content, mimetype FROM media WHERE file_id = ?';

  client.execute(query, [file_id], function(err, result) {
    if (err) {
      console.log(err);
      return res.status(404).json({
        status: "Couldn't retrieve file"
      })
    } else {
      var data = result.rows[0].content;
      var mimetype = result.rows[0].mimetype;

      // console.log('RETRIEVING FILE ' + file_id);
      // console.log('================');
      // console.log('');
      // console.log(data);
      // console.log('');

      res.set('Content-Type', mimetype);
      res.header('Content-Type', mimetype);

      res.writeHead(200, {
        'Content-Type': mimetype,
        'Content-disposition': 'attachment;filename=' + file_id,
        'Content-Length': data.length
      });
      res.end(new Buffer(data, 'binary'));
    }
  })

}
