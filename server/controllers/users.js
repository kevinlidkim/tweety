var db = require('../../db');
var ObjectId = require('mongodb').ObjectId;
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var _ = require('lodash');
var moment = require('moment');
var shortid = require('shortid');

var make_salt = function() {
  return crypto.randomBytes(16).toString('base64');
}

var encrypt_password = function(password, salt) {
  if (!password || !salt) {
    return '';
  }
  salt = new Buffer(salt, 'base64');
  return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
}

var authenticate = function(password, salt, hashed_password) {
  return encrypt_password(password, salt) === hashed_password;
}


exports.add_user_email = function(req, res) {

  if (db.get() == null) {
    return res.status(500).json({
      status: 'error',
      error: 'Database error'
    })
  }

  var collection = db.get().collection('users');
  collection.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }]
  })
    .then(user => {
      if (user) {
        return res.status(500).json({
          status: 'error',
          error: 'Email or username already in use'
        })
      } else {
        var salt = shortid.generate();
        var hashed_password = encrypt_password(req.body.password, salt);
        var random_key = shortid.generate();
        collection.insert({
          username: req.body.username,
          email: req.body.email,
          salt: salt,
          hashed_password: hashed_password,
          verified: false,
          random_key: random_key
        })
          .then(function(data) {

            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'noreplyeliza@gmail.com',
                pass: 'cse356!@'
              }
            });

            var mail_options = {
              from: '"Eliza 👻" <noreplyeliza@gmail.com>', // sender address
              to: req.body.email, // list of receivers
              subject: 'Eliza Verification ✔', // Subject line
              text: random_key, // plain text body
              html: '<b>' + random_key + '</b>' // html body
            };

            transporter.sendMail(mail_options, (error, info) => {
              if (!error) {
                return res.status(200).json({
                  status: 'OK',
                  message: 'Successfully created user'
                })
              } else {
                return res.status(500).json({
                  status: 'error',
                  error: 'Unable to send email'
                })
              }
            });
          })
          .catch(err => {
            console.log(err);
            return res.status(500).json({
              status: 'error',
              error: 'Error creating user'
            })
          })
      }
    })

}


exports.add_user = function(req, res) {

  if (db.get() == null) {
    return res.status(500).json({
      status: 'error',
      error: 'Database error'
    })
  }

  var start = moment();

  var collection = db.get().collection('users');
  var salt = shortid.generate();
  var hashed_password = encrypt_password(req.body.password, salt);
  var random_key = shortid.generate();
  collection.insert({
    username: req.body.username,
    email: req.body.email,
    salt: salt,
    hashed_password: hashed_password,
    verified: false,
    random_key: random_key
  })
    .then(data => {
      var end = moment();
      var diff = end.diff(start);
      // console.log(diff + "              Adding user");
      return res.status(200).json({
        time_diff: diff,
        status: 'OK',
        message: 'Successfully created user'
      })
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        status: 'error',
        error: 'Error creating user'
      })
    })

}

exports.verify = function(req, res) {

  var start = moment();

  if (db.get() == null) {
    return res.status(500).json({
      status: 'error',
      error: 'Database error'
    })
  }

  // var start = moment();

  var collection = db.get().collection('users');
  collection.findOne({
    email: req.body.email
  })
    .then(function(user) {
      if (!user) {
        return res.status(500).json({
          status: 'error',
          error: 'Email not in use'
        })
      }
      else if (user.verified == true) {
        return res.status(500).json({
          status: 'error',
          error: 'User already verified'
        })
      } else {
        if (req.body.key == 'abracadabra' || req.body.key == user.random_key) {
          collection.update(
            { _id: ObjectId(user._id) },
            { $set: { 'verified' : true} }
          )
            .then(data => {
              var end = moment();
              var diff = end.diff(start);
              // console.log(diff + "              Verifying user");
              return res.status(200).json({
                time_diff: diff,
                status: 'OK',
                message: 'Successfully verified user'
              })
            })
            .catch(err => {
              console.log(err);
              return res.status(200).json({
                status: 'error',
                error: 'Unable to verify user'
              })
            })
        } else {
          return res.status(401).json({
            status: 'error',
            error: 'Invalid verification token'
          })
        }
      }
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        status: 'error',
        error: 'Error finding user in database'
      })
    })
}

exports.login = function(req, res) {

  if (db.get() == null) {
    return res.status(500).json({
      status: 'error',
      error: 'Database error'
    })
  } 
  // else if (req.session.user) {
  //   return res.status(500).json({
  //     status: 'error',
  //     error: 'Another user already logged in current session'
  //   })
  // }

  var start = moment();

  var collection = db.get().collection('users');
  collection.findOne({
    username: req.body.username
  })
    .then(user => {
      if (!user) {
        // console.log('user doesnt exist ' + req.body.username);
        return res.status(500).json({
          status: 'error',
          error: 'Invalid username'
        })
      } else if (user.verified == false) {
        // console.log('user not verified ' + req.body.username);
        return res.status(401).json({
          status: 'error',
          error: 'User not verified yet'
        })
      } else {
        if (!authenticate(req.body.password, user.salt, user.hashed_password)) {
          // console.log('bad password' + req.body.username);
          return res.status(401).json({
            status: 'error',
            error: 'Invalid password'
          })
        } else {
          req.session.user = user.username;
          // console.log('login success ' + req.session.user);
          var end = moment();
          var diff = end.diff(start);
          // console.log(diff + "              Logging in");
          return res.status(200).json({
            time_diff: diff,
            status: 'OK',
            message: 'Logged in successfully',
            user: user.username
          })
        }
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        status: 'error',
        message: 'Error logging in'
      })
    })
}

exports.auth = function(req, res) {
  if (!req.session.user) {
    return res.status(200).json({
      status: false
    });
  } else {
    return res.status(200).json({
      status: true,
      user: req.session.user
    })
  }
}

exports.logout = function(req, res) {
  // if (req.session.user) {
  //   req.session.destroy();
  //   return res.status(200).json({
  //     status: 'OK',
  //     message: 'Successfully logged out'
  //   })
  // } else {
  //   return res.status(500).json({
  //     status: 'error',
  //     error: 'No logged in user'
  //   })
  // }
  
  if (req.session.user) {
    req.session.destroy();
  }
  return res.status(200).json({
    status: 'OK',
    message: 'Successfully logged out'
  })
}

exports.get_user = function(req, res) {

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

  var start = moment();

  var obj = {
    email: "",
    followers: [],
    following: []
  }

  var collection = db.get().collection('users');
  var sec_collection = db.get().collection('follows');
  collection.findOne({
    username: req.params.username
  })
    .then(user => {
      if (!user) {
        return res.status(500).json({
          status: 'error',
          error: "Can't find user by username"
        })
      } else {
        obj.email = user.email;

        // query for other users this user is following
        sec_collection.find({
          follower: req.params.username
        }).toArray()
          .then(user_follows => {
            _.forEach(user_follows, user_follow => {
              obj.following.push(user_follow.following);
            })

            // query for other users following this user
            sec_collection.find({
              following: req.params.username
            }).toArray()
              .then(user_followers => {
                _.forEach(user_followers, user_follower => {
                  obj.followers.push(user_follower.follower);
                })
                var end = moment();
                var diff = end.diff(start);
                // console.log(diff + "              Finding user");
                return res.status(200).json({
                  time_diff: diff,
                  status: 'OK',
                  message: 'Successfully found user information',
                  user: {
                    email: obj.email,
                    followers: obj.followers.length,
                    following: obj.following.length,
                    username: req.params.username
                  }
                })
              })
              .catch(followers_err => {
                console.log(followers_err);
                return res.status(500).json({
                  status: 'error',
                  error: 'Error querying for other users following current user'
                })
              })
          })
          .catch(follows_err => {
            console.log(follows_err);
            return res.status(500).json({
              status: 'error',
              error: 'Error querying for other users that current user is following'
            })
          })
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        status: 'error',
        error: 'Error querying database for username'
      })
    })
}

exports.follow = function(req, res) {
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

  var collection = db.get().collection('users');
  var sec_collection = db.get().collection('follows');
  collection.findOne({
    username: req.body.username
  })
    .then(user => {
      // if user exists, then we can proceed
      if (user) {
        // check to see if we are following or unfollowing
        if (req.body.follow) {
          // check to see if relationship exists or not
          sec_collection.findOne({
            follower: req.session.user,
            following: req.body.username
          })
            .then(relationship => {
              // relationship already exists
              if (relationship) {
                return res.status(500).json({
                  status: 'error',
                  error: 'Already following user'
                })
              } else {
                sec_collection.insert({
                  follower: req.session.user,
                  following: req.body.username
                })
                  .then(follow_success => {
                    var end = moment();
                    var diff = end.diff(start);
                    // console.log(diff + "              Following user");
                    return res.status(200).json({
                      time_diff: diff,
                      status: 'OK',
                      message: 'Successfully following user'
                    })
                  })
                  .catch(follow_fail => {
                    return res.status(500).json({
                      status: 'error',
                      error: 'Failed to create follow relationship'
                    })
                  })
              }
            })
            .catch(relationship_err => {
              return res.status(500).json({
                status: 'error',
                error: "Error querying follow relationship"
              })
            })
        } else {
          // we are unfollowing in this case
          sec_collection.findOne({
            follower: req.session.user,
            following: req.body.username
          })
            .then(unfollow_relationship => {
              // relationship exists
              if (unfollow_relationship) {
                sec_collection.remove({
                  follower: req.session.user,
                  following: req.body.username
                })
                  .then(unfollow_success => {
                    var end = moment();
                    var diff = end.diff(start);
                    // console.log(diff + "              Unfollowing user");
                    return res.status(200).json({
                      time_diff: diff,
                      status: 'OK',
                      message: 'Successfully unfollowed user'
                    })
                  })
                  .catch(unfollow_fail => {
                    return res.status(500).json({
                      status: 'error',
                      error: 'Failed to delete follow relationship'
                    })
                  })
              } else {
                return res.status(500).json({
                  status: 'error',
                  error: 'User is currently not following target'
                })
              }
            })
        }
      } else {
        return res.status(500).json({
          status: 'error',
          error: "Couldn't find user to follow"
        })
      }
    })
    .catch(err => {
      return res.status(500).json({
        status: 'error',
        error: "Error finding user to follow"
      })
    })

}

exports.get_followers = function(req, res) {
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

  var limit = 50;
  if (req.body.limit) {
    if (req.body.limit > 200) {
      limit = 200;
    } else {
      limit = req.body.limit
    }
  }

  var collection = db.get().collection('follows');
  collection.find({
    following: req.params.username
  }).toArray()
    .then(data => {
      var items = [];
      _.forEach(data, item => {
        items.push(item.follower);
      })
      return res.status(200).json({
        status: 'OK',
        users: items
      })
    })
    .catch(err => {
      return res.status(500).json({
        status: 'error',
        error: 'Failed to get user followers'
      })
    })

}

exports.get_following = function(req, res) {
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

  var limit = 50;
  if (req.body.limit) {
    if (req.body.limit > 200) {
      limit = 200;
    } else {
      limit = req.body.limit
    }
  }

  var collection = db.get().collection('follows');
  collection.find({
    follower: req.params.username
  }).toArray()
    .then(data => {
      var items = [];
      _.forEach(data, item => {
        items.push(item.following);
      })
      return res.status(200).json({
        status: 'OK',
        users: items
      })
    })
    .catch(err => {
      return res.status(500).json({
        status: 'error',
        error: 'Failed to get user following'
      })
    })
}
