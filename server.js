var express = require('express');
var app = express();

var pathToApp = __dirname;

app.use('/static', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(pathToApp + '/src/index.html');
});

app.post('/yo', function(req, res) {
  console.log("YOO");
  return res.status(200).json({
    status: "SUP"
  })
})

// app.get('/yo', function(req, res) {
//   console.log("YOO");
// })

// app.get('*', function(req, res) {
//   res.sendFile(pathToApp + '/src/index.html');
// });

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

