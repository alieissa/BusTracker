'use strict';

dBService.$inject = ['$q', 'DATABASE'];

function dBService($q, DATABASE) {

	let db = openDatabase(DATABASE, '1.0', 'OC Transpo DB', 2 * 1024 * 1024); // 2MB;

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

	function getStops(route) {

        let defer = $q.defer();

        db.transaction(handleTx, handleErr);

        function handleTx(tx) {
          tx.executeSql('SELECT * FROM routes WHERE name = ?', [route.name], handleRes, handleErr);
        }

        function handleRes(tx, result) {

            let data = result.rows.item(0);
			let stops = [];
            let _stops = data.stops.split('\t');

            // stops number and name are both in a long space separated string
            _stops.forEach((stop) => {
				let number =  _stop.split(' ')[0];
				get('stop', {number: number}).then((stopInfo) => stops.push(stopInfo));
                // return {
                //     number: stop.split(' ')[0],
                //     name: stop.split(' ').slice(1).join(' ')
                // }

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
