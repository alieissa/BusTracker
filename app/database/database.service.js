'use strict';

function dBService() {

	let db;
	let $q;

	let setDB = db_ => db = db_;

	let $get = (_$q_) => {
		$q = _$q_;
		return {get, set, getStops}
	};

	return {$get, setDB};

	/*-------------------Factory function definitions-------------------------*/

	function get(table, filter) {

		let defer = $q.defer();

		db.transaction(handleTx, (tx, err) => {console.log(err); defer.reject(err)});

		function handleTx(tx) {

			if(typeof filter === 'undefined') {
				tx.executeSql(`SELECT * FROM ${table} ORDER BY number`, [], handleRes,(tx, err) => {console.log(err); defer.reject(err)});
			}
			else {

				let [key] = Object.keys(filter);
				let value = filter[key];

				tx.executeSql(`SELECT * FROM ${table} WHERE ${key} = ?`, [value], handleRes,(tx, err) => {console.log(err); defer.reject(err)});
			}
		}

		function handleRes(tx, result) {
			return defer.resolve(parseRes(result));
		}
		return defer.promise;
	}


	function set(table, setting, filter) {

		let [setKey] = Object.keys(setting);
		let setValue = setting[setKey];

		let [filterKey] = Object.keys(filter);
		let filterValue = filter[filterKey];

		let defer = $q.defer();

		db.transaction(handleTx, (tx, err) => {console.log(err); defer.reject(err)});

		function handleTx(tx, result) {
			tx.executeSql(`UPDATE ${table} SET ${setKey} = ? WHERE ${filterKey} = ?`, [setValue, filterValue], handleRes,(tx, err) => {console.log(err); defer.reject(err)});
		}

		function handleRes(tx, result) {
			return	defer.resolve(result.rows);
		}

		return defer.promise;
	}


	/*-------------------------------------------------------------------------
	  Reads the stops of each route and for EVERY stop reads the stop
	  information from the STOPS table using the stop NUMBER.
	---------------------------------------------------------------------------*/

	function getStops(route) {

        let defer = $q.defer();
        db.transaction(handleTx, (tx, err) => {console.log(err); defer.reject(err)});

        function handleTx(tx) {
          tx.executeSql('SELECT * FROM routes WHERE id = ?', [route.id], handleRes, (tx, err) => {console.log(err); defer.reject(err)});
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

        return defer.promise;
    }
}

function _handleErr(tx, err) {
	 return defer.reject(err);
}

function parseRes(result) {

	let data = [];
	for(let i = 0; i < result.rows.length; i++) {
		data.push(result.rows.item(i));
	}

	return data;
}

export {dBService};
