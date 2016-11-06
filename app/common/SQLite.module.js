'use strict';

angular.module('SQLiteMod', [])
	.constant('DATABASE', 'octranspo')
	.factory('dataService', dataService);


function dataService(DATABASE, $q) {
	
	const db = openDatabase(DATABASE, '1.0', 'OC Transpo DB', 2 * 1024 * 1024); // 2MB
	
	let dataService = {
		addFaveStop: addFaveStop,
		addFaveRoute: addFaveRoute,
		getFaveRoutes: getFaveRoutes,
		getFaveStops: getFaveStops,
		getAllRoutes: getAllRoutes,
		getAllStops: getAllStops,
		getRouteStops: getRouteStops
	};

	return dataService;


	function getAllRoutes() {

		let defer = $q.defer();
		
		db.transaction(handleRoutesResult, handleRoutesError);

		function handleRoutesResult(tx) {

			let routes = [];

			tx.executeSql('SELECT * FROM routes', [], (tx, result) => {
				
				for(let i = 0; i < result.rows.length; i++) {
					routes.push(result.rows.item(i));
				}

				defer.resolve(routes);
				return;
			});
		}

		function handleRoutesError(tx, error) {

			defer.reject(error);
			return;
		}

		return defer.promise;
		
	}

	function getAllStops() {
		// Get all stops

		let defer = $q.defer();
		
		db.transaction(handleStopsResult, handleStopsError);

		function handleStopsResult(tx) {

			let stops = []

			tx.executeSql('SELECT * FROM stops LIMIT 500', [], (tx, result) => {
				for (let i = 0; i < result.rows.length; i++) {
					stops.push(result.rows.item(i));
				}

				defer.resolve(stops);
				return;
			});
		}

		function handleStopsError(tx, error) {
			defer.reject(error);
			return;
		}

		return defer.promise;
	}

	function getRouteStops(routeName) {
		
		let defer = $q.defer();
		
		db.transaction(handleRouteStopsResult, handleRouteStopsError);

		function handleRouteStopsResult(tx) {

			let stops = []

			tx.executeSql('SELECT stops FROM routes WHERE name = ?', [routeName], (tx, result) => {

				let stopsString = result.rows.item(0).stops;
				stops = stopsString.split('\t');

				// stops number and name are both in a long space separated string
				stops = stops.map((stop) => {
					return {
						number: stop.split(' ')[0],
						name: stop.split(' ').slice(1).join(' ')
					}

				});

				defer.resolve(stops);
				return;
			});
		}

		function handleRouteStopsError(tx, error) {

			defer.reject(error);
			return;
		}

		return defer.promise;
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