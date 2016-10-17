var express = require('express');

var app = express();

app.use('/bower_components', express.static(__dirname + '/bower_components/'));
app.use('/build', express.static(__dirname + '/build/'));

app.use('/routes/views/', express.static(__dirname + '/src/app/routes/views/'))
// app.use('/routes/views/', express.static(__dirname + '/src/app/routes/views/'))
app.use('/', express.static(__dirname + '/src/app'))
app.use('/styles', express.static(__dirname + '/src/styles'))

app.get('/', function(req, res, err) {
  res.sendFile(__dirname + '/src/app/index.html');
});

app.listen(3000, function() {
  console.log('Listening on 3000 ---')
})
