'use strict';

dBService.$inject = ['$q', 'DATABASE'];

function dBService($q, DATABASE) {

	let db = openDatabase(DATABASE, '1.0', 'OC Transpo DB', 2 * 1024 * 1024); // 2MB;

	let DB = {
		getAll: getAll,
		getFaves: getFaves,
		getFaveStatus: getFaveStatus,
		setFaveStatus: setFaveStatus,
		getStops: getStops
	};

	return DB;

	/*-------------------Factory function definitions-------------------------*/

	function getAll(table) {


		let defer = $q.defer();
		db.transaction(handleTx, handleErr);

		/*-------------------------------------------------------
			Note: Can not insert table name using ? replacement.
			This is true for most SQL
		----------------------------------------------------------*/

		function handleTx(tx) {
			tx.executeSql(`SELECT * FROM ${table} ORDER BY number`, [], handleRes, handleErr);
		}

		function handleRes(tx, result) {

			let data = [];
			for(let i = 0; i < result.rows.length; i++) {
				data.push(result.rows.item(i));
			}

			defer.resolve(data);
			return;
		}

		function handleErr(tx, err) {
			console.log(err);
			return defer.reject(err);
		}

		return defer.promise;
	}

	function getFaves(table) {

			let defer= $q.defer();
			db.transaction(handleTx, handleErr);

			function handleTx(tx) {
				tx.executeSql(`SELECT * FROM ${table} WHERE favourite = 1`, [], handleRes, handleErr);
			}

			function handleRes(tx, result) {

				let data = [];
				for(let i = 0; i < result.rows.length; i++) {
					data.push(result.rows.item(i));
				}

				defer.resolve(data);
				return;
			}

			function handleErr(tx, err) {
				console.log(err);
				return defer.reject(err);
			}

			return defer.promise;

	}

	function getFaveStatus(table) {
		return (key, value) => {

			let defer= $q.defer();
			db.transaction(handleTx, handleErr);

			function handleTx(tx, result) {
				tx.executeSql(`SELECT favourite FROM ${table} WHERE ${key} = ?`, [value], handleRes, handleErr);
			}

			function handleRes(tx, result) {
				return defer.resolve(result.rows.item(0).favourite);
			}

			function handleErr(tx, error) {
				return defer.reject(error);
			}

			return defer.promise;
		};
	}

	function setFaveStatus(table) {
		return (status, key, value) => {

			let defer = $q.defer();

			db.transaction(handleTx, handleErr);

			function handleTx(tx, result) {
				tx.executeSql(`UPDATE ${table} SET favourite = ? WHERE ${key} = ?`, [status, value], handleRes, handleErr);
			}

			function handleRes(tx, result) {
				defer.resolve(result.rows);
				return;
			}

			function handleErr(tx, err) {
				console.log(err);
				 return defer.reject(err);
			}

			return defer.promise;
		};
	}

	function getStops(name) {

        let defer = $q.defer();

        // let db = openDatabase('octranspo', '1.0', 'OC Transpo DB', 2 * 1024 * 1024); // 2MB

        db.transaction(handleTx, handleErr);

        function handleTx(tx) {
          tx.executeSql('SELECT * FROM routes WHERE name = ?', [name], handleRes, handleErr);
        }

        function handleRes(tx, result) {

            let data = result.rows.item(0);

            let stops = data.stops.split('\t');

            // stops number and name are both in a long space separated string
            stops = stops.map((stop) => {
                return {
                    number: stop.split(' ')[0],
                    name: stop.split(' ').slice(1).join(' ')
                }

            });

            data.stops = stops;
            data.favourite = parseInt(data.favourite);
            defer.resolve(data);
            return;
        }

        function handleErr(tx, error) {
          console.log(error);
          return defer.reject(error);
        }

        return defer.promise;
    }
}

export {dBService};
