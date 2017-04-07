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
      if (data) {
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

exports.search_items_new = function(req, res) {

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
        collection.aggregate([
          { $match: { 
              timestamp: { $lte: time }
            }
          },
          { $project: { id: "$_id" } },
          { $sort: { timestamp: -1 } }
        ], function(err, query_success) {
          if (err) {
            return res.status(500).json({
              status: 'error',
              error: 'unknown aggregation error'
            })
          }
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

      }
    }
  }

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


exports.search_items_aggregate = function(req, res) {

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
  if (typeof req.body.following != undefined) {
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
            collection.aggregate([
              { $match: { 
                  timestamp: { $lte: time }, 
                  username: req.body.username, 
                  $text: { $search: req.body.q }
                }
              },
              { $project: { id: "$_id" } },
              { $sort: { timestamp: -1 } }
            ]).exec()
              .then(query_success => {
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
            collection.aggregate([
              { $match: { 
                  timestamp: { $lte: time }, 
                  username: req.body.username
                }
              },
              { $project: { id: "$_id" } },
              { $sort: { timestamp: -1 } }
            ]).exec()
              .then(no_query_success => {
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
            collection.aggregate([
              { $match: { 
                  timestamp: { $lte: time }, 
                  username: { $in: follows }, 
                  $text: { $search: req.body.q }
                }
              },
              { $project: { id: "$_id" } },
              { $sort: { timestamp: -1 } }
            ]).exec()
              .then(query_success => {
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
            collection.aggregate([
              { $match: { 
                  timestamp: { $lte: time }, 
                  username: { $in: follows }
                }
              },
              { $project: { id: "$_id" } },
              { $sort: { timestamp: -1 } }
            ]).exec()
              .then(no_query_success => {
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
        collection.aggregate([
          { $match: { 
              timestamp: { $lte: time },  
              username: req.body.username, 
              $text: { $search: req.body.q },
            }
          },
          { $project: { id: "$_id" } },
          { $sort: { timestamp: -1 } }
        ]).exec()
          .then(query_success => {
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
        collection.aggregate([
          { $match: { 
              timestamp: { $lte: time }, 
              username: req.body.username
            }
          },
          { $project: { id: "$_id" } },
          { $sort: { timestamp: -1 } }
        ]).exec()
          .then(query_success => {
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
        collection.aggregate([
          { $match: { 
              timestamp: { $lte: time }, 
              $text: { $search: req.body.q }
            }
          },
          { $project: { id: "$_id" } },
          { $sort: { timestamp: -1 } }
        ]).exec()
          .then(query_success => {
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
        collection.aggregate([
          { $match: { 
              timestamp: { $lte: time }
            }
          },
          { $project: { id: "$_id" } },
          { $sort: { timestamp: -1 } }
        ]).exec()
          .then(query_success => {
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
