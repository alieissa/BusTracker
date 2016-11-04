'use strict';

angular.module('SQLiteMod', [])
	.factory('dataService', dataService);


function dataService() {
    console.log('SQLite Service Test');
	const db = window.sqlitePlugin.openDatabase({name: 'octranspo.db', location: './'});
	
	db.transaction(func1, func2);

	function func1(tx) {
    	tx.executeSql('SELECT count(*) AS mycount FROM routes', [], function(tx, rs) {
      		console.log('Record count (expected to be 2): ' + rs.rows.item(0).mycount);
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
		// Get all routes
	}

	function getAllStops() {
		// Get all stops
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