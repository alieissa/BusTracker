'use strict';

function dBService() {

    let db;
    let $q;

    return {
        setDB: db_ => db = db_,
        $get: _$q_ => {
            $q = _$q_;
            return {get, set, getStops};
        }
    };

    function get(table, filter) {

        let defer = $q.defer();
        let _key, _value;
        let _handleRes = (tx, result) => defer.resolve(parseRes(result));

        let _handleTx = tx => {

            try {
                [_key] = Object.keys(filter);
                _value = filter[_key];
                tx.executeSql(`SELECT * FROM ${table} WHERE ${_key} = ? ORDER BY number`, [_value], _handleRes,(tx, err) => defer.reject(err));
            }
            catch(TypeError) {
                tx.executeSql(`SELECT * FROM ${table} ORDER BY number`, [], _handleRes,(tx, err) => defer.reject(err));
            }
        };

        db.transaction(_handleTx, (tx, err) => defer.reject(err));
        return defer.promise;
    }

    function set(table, setting, filter) {

        let [setKey] = Object.keys(setting);
        let setValue = setting[setKey];

        let [filterKey] = Object.keys(filter);
        let filterValue = filter[filterKey];

        let defer = $q.defer();

        let _handleRes = (tx, result) => defer.resolve(result.rows);

        let _handleTx = (tx, result) => {
            tx.executeSql(`UPDATE ${table} SET ${setKey} = ? WHERE ${filterKey} = ?`,
                [setValue, filterValue], _handleRes,(tx, err) => defer.reject(err));
        };

        db.transaction(_handleTx, (tx, err) => defer.reject(err));
        return defer.promise;
    }


    /*-------------------------------------------------------------------------
      Reads the stops of each route and for EVERY stop reads the stop
      information from the STOPS table using the stop NUMBER.
    ---------------------------------------------------------------------------*/

    function getStops(route) {

        let defer = $q.defer();

        let _handleRes = (tx, result) => {

            let data = result.rows.item(0);
            let stops = [];

            // Get stop data fro every stop
            sortStops(data.stops).forEach(number => {
                get('stops', {number: number}).then(result => stops.push(result[0]));
            });

            data.stops = stops;
            data.favourite = parseInt(data.favourite);
            return defer.resolve(data);
        };

        let _handleTx = tx => {
          tx.executeSql('SELECT * FROM routes WHERE id = ?', [route.id], _handleRes, (tx, err) => defer.reject(err));
      };

        db.transaction(_handleTx, (tx, err) => defer.reject(err));
        return defer.promise;
    }
}


// TODO. Fix this in source data
function sortStops(rawStops) {

    // Get stop number from each stop name stop number string.
    let _stops = rawStops.split('\t');
    let uniqueStopNumbers = new Set(_stops.map(stop => parseInt(stop.split(' ')[0])));

    // Must convert to array in order to sort
    return [...uniqueStopNumbers].sort();
}

function parseRes(result) {

    let data = [];
    for(let i = 0; i < result.rows.length; i++) {
        data.push(result.rows.item(i));
    }
    return data;
}

export {dBService};
