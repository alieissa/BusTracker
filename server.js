let express = require('express');
let sqlite = require('sqlite3')
let bodyParser = require('body-parser');
let path = require('path');
let request = require('request');
let app = express();

app.use(bodyParser());

app.use('/', express.static(path.join(__dirname, 'dist/')));


app.use('/cordova.js', function(req, res, next) {
	// console.log('No cordova');
	res.send('200');
});

app.get('/routes/', function(req, res, err) {
	console.log('/routes')
});

app.get('/routes/:id', (req, res, err) => {
	console.log('routes/:id')
});

app.get('/stops/:number', (req, res, err) => {
	console.log('stops/number')
});

app.post('/v1.2/GetNextTripsForStopAllRoutes', function(req, res, err) {

	let url = 'https://api.octranspo1.com/v1.2/GetNextTripsForStopAllRoutes';
	let ocReq = {url:url, form: req.body};


	// Sends url encoded form data
	request.post(ocReq, (err, ocRes) => {
		console.log(ocRes.body);
		res.send(ocRes.body);
	})

})

app.post('/v1.2/GetNextTripsForStop', (req, res, err) => {
	console.log(res.body);
	let url = 'https://api.octranspo1.com/v1.2/GetNextTripsForStop';
	let ocReq = {url:url, form: req.body};
	console.log(req.body);

	request.post(ocReq, (err, ocRes) => {
		console.log(ocRes.body);
		res.send(ocRes.body)
		res.end();
	})
})

app.listen(3000, function() {
  console.log('Listening on 3000 ---')
})
