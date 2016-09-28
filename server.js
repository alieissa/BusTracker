var express = require('express');

var app = express();

app.use('/bower_components', express.static(__dirname + '/bower_components/'));
app.use('/', express.static(__dirname + '/app/'))

app.get('/', function(req, res, err) {
  res.sendFile(__dirname + '/app/index.html');
});

app.listen(3000, function() {
  console.log('Listening on 3000 ---')
})
