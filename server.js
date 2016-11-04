let express = require('express');
let path = require('path');
let app = express();


app.use('/', express.static(path.join(__dirname, 'dist/')));
// app.use('/routes', express.static(__dirname + '/app/routes'));
// app.use('/stops', express.static(__dirname + '/app/stops'));

app.use('/cordova.js', function(req, res, next) {
	// console.log('No cordova');
	res.send('200');
});

// app.get('/', function(req, res, err) {
// 	res.sendFile(__dirname + '/web.html');
// })

app.listen(3000, function() {
  console.log('Listening on 3000 ---')
})
