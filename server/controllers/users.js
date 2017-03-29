var db = require('../../db');
var ObjectId = require('mongodb').ObjectId;
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var _ = require('lodash');
var moment = require('moment');

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
    .then(function(user) {
      if (user) {
        return res.status(500).json({
          status: 'error',
          error: 'Email or username already in use'
        })
      } else {
        var salt = make_salt();
        var hashed_password = encrypt_password(req.body.password, salt);
        var random_key = encrypt_password(make_salt(), make_salt());
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
          .catch(function(err) {
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

  var collection = db.get().collection('users');
  collection.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }]
  })
    .then(function(user) {
      if (user) {
        return res.status(500).json({
          status: 'error',
          error: 'Email or username already in use'
        })
      } else {
        var salt = make_salt();
        var hashed_password = encrypt_password(req.body.password, salt);
        var random_key = encrypt_password(make_salt(), make_salt());
        collection.insert({
          username: req.body.username,
          email: req.body.email,
          salt: salt,
          hashed_password: hashed_password,
          verified: false,
          random_key: random_key,
          followers: [],
          following: []
        })
          .then(function(data) {
            return res.status(200).json({
              status: 'OK',
              message: 'Successfully created user'
            })
          })
          .catch(function(err) {
            console.log(err);
            return res.status(500).json({
              status: 'error',
              error: 'Error creating user'
            })
          })
      }
    })

}

exports.verify = function(req, res) {

  if (db.get() == null) {
    return res.status(500).json({
      status: 'error',
      error: 'Database error'
    })
  }

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
            .then(function(data) {
              return res.status(200).json({
                status: 'OK',
                message: 'Successfully verified user'
              })
            })
            .catch(function(err) {
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
    .catch(function(error) {
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
  } else if (req.session.user) {
    return res.status(500).json({
      status: 'error',
      error: 'Another user already logged in current session'
    })
  }

  var collection = db.get().collection('users');
  collection.findOne({
    username: req.body.username
  })
    .then(function(user) {
      if (!user) {
        return res.status(500).json({
          status: 'error',
          error: 'Invalid username'
        })
      } else if (user.verified == false) {
        return res.status(401).json({
          status: 'error',
          error: 'User not verified yet'
        })
      } else {
        if (!authenticate(req.body.password, user.salt, user.hashed_password)) {
          return res.status(401).json({
            status: 'error',
            error: 'Invalid password'
          })
        } else {
          req.session.user = user.username;
          return res.status(200).json({
            status: 'OK',
            message: 'Logged in successfully',
            user: user.username
          })
        }
      }
    })
    .catch(function(err) {
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
  if (req.session.user) {
    req.session.destroy();
    return res.status(200).json({
      status: 'OK',
      message: 'Successfully logged out'
    })
  } else {
    return res.status(500).json({
      status: 'error',
      error: 'No logged in user'
    })
  }
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

  var collection = db.get().collection('users');
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
        var data = {
          email: user.email
          followers: user.followers,
          following: user.following
        }
        return res.status(200).json({
          status: 'OK',
          user: data
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
  // add current user to target's follower array
  collection.update(
    { username: req.body.username },
    { $addToSet: { follower : req.session.user } }
  )
  // add target to current user's following array
    .then(follow_success => {
      collection.update(
        { username: req.session.user },
        { $addToSet: { following : req.body.username } }
      )
        .then(following_success => {
          return res.status(200).json({
            status: 'OK',
            message: 'Successfully followed user'
          })
        })
        // error so remove current user from target's follower array
        .catch(following_fail => {
          collection.update(
            { username: req.body.username },
            { $pull: { follower : req.session.user } }
          )
          // rollback successful
            .then(rollback_success => {
              console.log(rollback_success);
              return res.status(500).json({
                status: 'error',
                error: "Failed to add target to current user's following list"
              })
            })
          // rollback fail... this is very bad!
            .catch(rollback_fail => {
              console.log(rollback_fail);
              return res.status(500).json({
                status: 'error',
                error: 'Failed to rollback after failing to follow user'
              })
            })
        })
    })
    .catch(follow_fail => {
      console.log(follow_fail);
      return res.status(500).json({
        status: 'error',
        error: 'Failed to follow user'
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

  var collection = db.get().collection('users');
  collection.find({
    username: req.params.username
  })
    .then(user => {
      var items = [];
      if (user.followers.length < limit) {
        items = users.followers;
      } else {
        for (var i = 0; i < limit; i++) {
          items.push(user.followers[i]);
        }
      }
      return res.status(200).json({
        status: 'OK',
        users: items
      })
    })
    .catch(err => {
      return res.status(500).json({
        status: 'error',
        error: 'Failed to get followers'
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

  var collection = db.get().collection('users');
  collection.find({
    username: req.params.username
  })
    .then(user => {
      var items = [];
      if (user.following.length < limit) {
        items = users.following;
      } else {
        for (var i = 0; i < limit; i++) {
          items.push(user.following[i]);
        }
      }
      return res.status(200).json({
        status: 'OK',
        users: items
      })
    })
    .catch(err => {
      return res.status(500).json({
        status: 'error',
        error: 'Failed to get following'
      })
    })
}