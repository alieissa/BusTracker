'use strict';

angular.module('SQLiteMod', [])
	.constant('DATABASE', 'octranspo')
	.factory('dataService', dataService);


function dataService(DATABASE, $q) {
	
	const db = openDatabase(DATABASE, '1.0', 'OC Transpo DB', 2 * 1024 * 1024); // 2MB
	
	let dataService = {
		addFaveStop: addFaveStop,
		getRouteFaveStatus: getRouteFaveStatus,
		setRouteFaveStatus: setRouteFaveStatus,
		getStopFaveStatus: getStopFaveStatus,
		setStopFaveStatus: setStopFaveStatus,
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


	// Get bus stops for bus 'routeName'
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

	function setRouteFaveStatus(route, status) {
		
		let defer = $q.defer();
		
		// Add route to db
		db.transaction(handleFaveRouteResult, handleFaveRouteError);

		function handleFaveRouteResult(tx) {

			tx.executeSql('UPDATE routes SET favourite = ? WHERE name = ?', [status, route], (tx, result) => {
				console.log(result)
				return defer.resolve(result.rows);
			});

		}

		function handleFaveRouteError(tx, error) {
			defer.reject(error);
		}

		return defer.promise;
	}

	function getRouteFaveStatus(route) {

		let defer = $q.defer();

		db.transaction(handleFaveRouteResult, handleFaveRouteError);

		function handleFaveRouteResult(tx) {
			tx.executeSql('SELECT favourite FROM routes WHERE name = ?', [route], (tx, result) => {
				return defer.resolve(result.rows.item(0).favourite);
			});

			return;
		}

		function handleFaveRouteError(tx, error) {

			defer.reject(error);

			return;
		}

		return defer.promise;
	}

	function getStopFaveStatus(stopNo) {
		let defer = $q.defer();

		db.transaction(handleDb, (tx, error) => defer.reject(error));

		function handleDb(tx) {
			tx.executeSql('SELECT favourite FROM stops WHERE number = ?', [stopNo], (tx, result) => {
				
				let faveStatus = result.rows.item(0).favourite;
				defer.resolve(faveStatus);

				return;
			});
		}

		return defer.promise;
	}
	
	function setStopFaveStatus(stopNo, faveStatus) {

		let defer = $q.defer();

		db.transaction(handleDb, (tx, error) => defer.reject(error));

		function handleDb(tx) {
			tx.executeSql('UPDATE stops SET favourite = ? WHERE number = ?', [faveStatus, stopNo], (tx, result) => {
				defer.resolve(result);
			});
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

	function addFaveStop(stop) {
		// Add route to db
	}
	function getFaveRoutes() {

		let defer = $q.defer();

		// Get fave route
		db.transaction(handleFaveRoutesResult, handleFaveRoutesError);

		function handleFaveRoutesResult(tx) {

			let faves = [];

			tx.executeSql('SELECT * FROM routes WHERE favourite = 1', (tx, result) => {
				for(let i = 0; i < result.rows.length; i++) {
					faves.push(result.rows.item(i));
				}
				
				defer.resolve(faves);
				return;
			});

		}

		function handleFaveRoutesError(tx, error) {
			defer.reject(error);
		}
	}

	function getFaveStops() {
		// Get fave stop
	}
}

export default angular.module('SQLiteMod');