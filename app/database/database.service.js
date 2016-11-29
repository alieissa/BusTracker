'use strict';

dBService.$inject = ['$q', 'DATABASE'];

function dBService($q, DATABASE) {

	let db;

	if(!window.isphone) {
		db = openDatabase(DATABASE, '1.0', 'OC Transpo DB', 2 * 1024 * 1024); // 2MB;
	}
	else {
		let handleDb = (dbb) => {
			alert('Opened db using sqlite plugin');
		}

		let handleErr = (err) => {
			alert("Sqlite plugin can't open db " + JSON.stringify(err));
		}

		let options = {name: "octranspo.db", location: 0};
		db = window.sqlitePlugin.openDatabase(options, handleDb, handleErr);
	}

	let DB = { get, set, getStops };
	return DB;

	/*-------------------Factory function definitions-------------------------*/

	function get(table, filter) {

		let defer = $q.defer();
		db.transaction(handleTx, handleErr);

		/*-------------------------------------------------------
			Note: Can not insert table name using ? replacement.
			This is true for most SQL
		----------------------------------------------------------*/

		function handleTx(tx) {

			if(typeof filter === 'undefined') {
				tx.executeSql(`SELECT * FROM ${table} ORDER BY number`, [], handleRes, handleErr);
			}
			else {

				let [key] = Object.keys(filter);
				let value = filter[key];

				tx.executeSql(`SELECT * FROM ${table} WHERE ${key} = ?`, [value], handleRes, handleErr);
			}
		}

		function handleRes(tx, result) {
			return defer.resolve(parseRes(result));
		}

		function handleErr(tx, err) {
			console.log(err);
			return defer.reject(err);
		}

		return defer.promise;
	}


	function set(table, setting, filter) {

		let [setKey] = Object.keys(setting);
		let setValue = setting[setKey];

		let [filterKey] = Object.keys(filter);
		let filterValue = filter[filterKey];

		let defer = $q.defer();

		db.transaction(handleTx, handleErr);

		function handleTx(tx, result) {
			tx.executeSql(`UPDATE ${table} SET ${setKey} = ? WHERE ${filterKey} = ?`, [setValue, filterValue], handleRes, handleErr);
		}

		function handleRes(tx, result) {
			return	defer.resolve(result.rows);
		}

		function handleErr(tx, err) {
			console.log(err);
			 return defer.reject(err);
		}

		return defer.promise;
	}


	/*-------------------------------------------------------------------------
	  Reads the stops of each route and for EVERY stop reads the stop
	  information from the STOPS table using the stop NUMBER.
	---------------------------------------------------------------------------*/

	function getStops(route) {

        let defer = $q.defer();
        db.transaction(handleTx, handleErr);

        function handleTx(tx) {
          tx.executeSql('SELECT * FROM routes WHERE id = ?', [route.id], handleRes, handleErr);
        }

        function handleRes(tx, result) {

            let data = result.rows.item(0);
			let stops = [];
            let _stops = data.stops.split('\t');

			// Get stop number from each stop name stop number string.
			// No duplicate values
			// TODO. Fix this in source data
			let uniqueStopNumbers = new Set(_stops.map(stop => parseInt(stop.split(' ')[0])));

			// Must convert to array in order to sort
			let orderedStopNumbers = [...uniqueStopNumbers].sort();

            // Get stop data fro every stop
            orderedStopNumbers.forEach((number) => {
				get('stops', {number: number}).then((result) => stops.push(result[0]));
            });

            data.stops = stops;
            data.favourite = parseInt(data.favourite);
            return defer.resolve(data);
        }

        function handleErr(tx, error) {
          console.log(error);
          return defer.reject(error);
        }

        return defer.promise;
    }
}

function parseRes(result) {

	let data = [];
	for(let i = 0; i < result.rows.length; i++) {
		data.push(result.rows.item(i));
	}

	return data;
}

export {dBService};
