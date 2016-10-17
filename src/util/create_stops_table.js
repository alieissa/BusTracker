var fs = require('fs');
var parse = require('csv-parse');
var firebase = require('firebase');
var config = require('./config/firebase.json');

firebase.initializeApp({
    apiKey: config.API_KEY,
    authDomain: config.AUTH_DOMAIN,
    databaseURL: config.DATABASE_URL,
    storageBucket: config.STORAGE_BUCKET,
    messagingSenderId: config.MESSAGING_SENDER_ID
  });
var database = firebase.database();

fs.readFile('stops.csv', 'utf8', (err, data) => {
  if(err)   return console.log(err);

  // parse the csv into rows
  parse(data, (err, stops) => {
    if(err) return console.log(err);

    // processs each row into stop object
    var stops = {};
    data.forEach((stop, index, self) => {
      stops[stop[0]] = {
        stop_code: stop[1],
        stop_id: stop[2],
        stop_lat: stop[3],
        stop_lon: stop[4],
        location_type: stop[5]
      }
    });

    // append data to firebase
    database.ref('/stops').set(stops);
  });
});
