'use strict';

angular.module('SQLiteMod', [])
	.constant('DATABASE', 'octranspo');
	.factory('dataService', dataService);


function dataService(DATABASE) {
    console.log('SQLite Service Test');
	const db = openDatabase(DATABASE, '1.0', 'OC Transpo DB', 2 * 1024 * 1024); 
	
	db.transaction(func1, func2);

	function func1(tx) {
		console.log('Database is opened successfully');
    	tx.executeSql('SELECT *  FROM sqlite_master', [], function(tx, rs) {
      		console.log('Record count (expected to be 2): ' + JSON.stringify(rs.rows.item(1)));
    	});
    }

    function func2(tx, error) {
      	console.log('SELECT error: ' + error.message);
    }

	let dataService = {
		addFaveStop: addFaveStop,
		addFaveRoute: addFaveRoute,
		getFaveRoutes: getFaveRoutes,
		getFaveStops: getFaveStops,
		getAllRoutes: getAllRoutes,
		getAllStops: getAllStops
	};

	return dataService;


	function getAllRoutes() {

		db.transaction(handleRoutesResult, handleRoutesError)

		function handleRoutesResult(tx) {
			// Resolve promise here
			tx.executeSql('SELECT * FROM routes', [], (tx, result) => console.log(result.rows));
			// tx.executeSql('SELECT count(*) FROM routes', [], (tx, result) => console.log(result.rows));
		}

		function handleRoutesError(tx, error) {
			// Reject promise
			console.log(error.message);
		}
		
	}

	function getAllStops() {
		// Get all stops

		db.transaction(handleStopsResult, handleStopsError)

		function handleStopsResult(tx) {
			// Resolve promise here
			tx.executeSql('SELECT * FROM stops', [], (tx, result) => console.log(result.rows));
			// tx.executeSql('SELECT count(*) FROM stops', [], (tx, result) => console.log(result.rows));
		}

		function handleStopsError(tx, error) {
			// Reject promise
			console.log(error.message);
		}
	}

	function addFaveRoute(route) {
		// Add route to db
	}

	function addFaveStop(stop) {
		// Add route to db
	}

	function getFaveRoutes(routeName) {
		// Get fave route
	}

	function getFaveStops(stopNo) {
		// Get fave stop
	}
}

export default angular.module('SQLiteMod');