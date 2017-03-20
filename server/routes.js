var db = require('../db');

module.exports = function(app) {

  app.post('/yo', function(req, res) {
    console.log("YOO");
    return res.status(200).json({
      status: "SUP"
    })
  })

  app.get('*', function(req, res) {
    res.sendfile('./src/index.html');
  });

};