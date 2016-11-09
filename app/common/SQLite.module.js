'use strict';

angular.module('SQLiteMod', [])
	.constant('DATABASE', 'octranspo')
	.factory('dataService', dataService);


function dataService(DATABASE, $q) {
	
	const db = openDatabase(DATABASE, '1.0', 'OC Transpo DB', 2 * 1024 * 1024); // 2MB
	
	let dataService = {
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
	function getRouteStops(name) {
		
		let defer = $q.defer();
		
		db.transaction(handleRouteStopsResult, handleRouteStopsError);

		function handleRouteStopsResult(tx) {

			let stops = []

			tx.executeSql('SELECT * FROM routes WHERE name = ?', [name], (tx, result) => {

				let data = result.rows.item(0);

				stops = data.stops.split('\t');

				// stops number and name are both in a long space separated string
				stops = stops.map((stop) => {
					return {
						number: stop.split(' ')[0],
						name: stop.split(' ').slice(1).join(' ')
					}

				});

				data.stops = stops;
				data.favourite = parseInt(data.favourite); //SQLite returns float
				defer.resolve(data);
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
		db.transaction(handleFaveRouteResult, (tx, result) => defer.reject(error));

		function handleFaveRouteResult(tx) {

			tx.executeSql('UPDATE routes SET favourite = ? WHERE name = ?', [status, route], (tx, result) => {
				console.log(result)
				return defer.resolve(result.rows);
			});

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


	function getFaveRoutes() {

		let defer = $q.defer();
		
		// Get fave route
		db.transaction(handleData, (tx, error) => defer.reject(error));

		function handleData(tx) {

			let faves = [];

			// SQLite storing fav as float because JS doesn't do real ints.
			tx.executeSql('SELECT * FROM routes WHERE favourite > 0.0', [], (tx, result) => {
				
				for(let i = 0; i < result.rows.length; i++) {
					faves.push(result.rows.item(i));
				}
				
				defer.resolve(faves);
				return;
			});

		}

		return defer.promise;
	}

	function getFaveStops() {
		// Get fave stop
		let defer = $q.defer();

		let stops = [];

		db.transaction(handleTx, (tx, error) => defer.reject(error));

		function handleTx(tx) {

			tx.executeSql('SELECT * FROM stops WHERE favourite > 0.0', [], (tx, result) => {
				// let stops = result.rows.item(0);
				for (let i = 0; i < result.rows.length; i++) {
					stops.push(result.rows[i]);
				}
				console.log(stops);
				// console.log(result.rows[result.rows.length - 1])
				// console.log(result.rows);
				defer.resolve(stops);

				return;
			});
		}

		return defer.promise;
	}
}

export default angular.module('SQLiteMod');