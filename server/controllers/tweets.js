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

  var collection = db.get().collection('tweet');
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

  // create a query object. if optional fields are present, add them to query object

  var collection = db.get().collection('tweet');
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

  var time = moment().unix();
  var limit = 25;

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

  var collection = db.get().collection('tweet');
  collection.find({
    timestamp: { $lte: time }
  }).sort({timestamp: -1}).limit(limit).toArray()
    .then(data => {
      var items = [];
      _.forEach(data, item => {
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
        items: items
      })
    })
      .catch(err => {
        console.log(err);
        return res.status(500).json({
          status: 'error',
          error: 'Could not query for tweets'
        })
      })

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

  var collection = db.get().collection('tweet');
  collection.remove({
    _id: ObjectId(req.params.id)
  })
    .then(data => {
      return res.status(200).json({
        status: 'OK'
      })
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        status: 'error',
        error: 'Unable to delete tweet'
      })
    })
}