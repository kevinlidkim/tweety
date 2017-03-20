var db = require('../db');

module.exports = function(app) {

  app.post('/yo', function(req, res) {
    console.log("YOO");
    return res.status(200).json({
      status: "SUP"
    })
  })

  app.post('/login', function(req, res) {
    console.log(req.body);
    console.log("LOGIN");
    return res.status(200).json({
      status: "LOGIN"
    })
  })

  app.post('/adduser', function(req, res) {
    console.log(req.body);
    console.log("ADDUSER");
    return res.status(200).json({
      status: "ADDUSER",
      user: 'kev'
    })
  })

  app.get('*', function(req, res) {
    res.sendfile('./src/index.html');
  });

};