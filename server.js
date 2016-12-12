let bodyParser = require('body-parser');
let express = require('express');
let path = require('path');
let request = require('request');
let sqlite = require('sqlite3')

let app = express();

app.use(bodyParser());
app.use('/', express.static(path.join(__dirname, 'dist/')));
app.use('/cordova.js', (req, res, next) => res.send('200'));

app.post('/v1.2/GetNextTripsForStopAllRoutes', function(req, res, err) {

    let url = 'https://api.octranspo1.com/v1.2/GetNextTripsForStopAllRoutes';
    let ocReq = {url:url, form: req.body};

    // Sends url encoded form data
    request.post(ocReq, (err, ocRes) => {
        console.log(ocRes.body);
        res.send(ocRes.body);
    });

});

app.post('/v1.2/GetNextTripsForStop', (req, res, err) => {

    let url = 'https://api.octranspo1.com/v1.2/GetNextTripsForStop';
    let ocReq = {url:url, form: req.body};

    request.post(ocReq, (err, ocRes) => {
        console.log(ocRes.body);
        res.send(ocRes.body)
        res.end();
    });
});

app.listen(3000, () => console.log('Listening on 3000 ---'));
