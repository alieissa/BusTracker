let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let request = require('request');
let app = express();

app.use(bodyParser());

app.use('/', express.static(path.join(__dirname, 'dist/')));
// app.use('/routes', express.static(__dirname + '/app/routes'));
// app.use('/stops', express.static(__dirname + '/app/stops'));

app.use('/cordova.js', function(req, res, next) {
	// console.log('No cordova');
	res.send('200');
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



app.listen(3000, function() {
  console.log('Listening on 3000 ---')
})
