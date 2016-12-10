'use strict';

dataService.$inject = ['dBService'];

function dataService(dBService) {

    let stops, routes;
    let routeFields = ['name','stops', 'favourite','number','id'];
    let stopFields = ['name','number','code','lat','lon','type','favourite'];

    let setStopsDataset = stopsDataSet => stops = stopsDataSet;
    let setRoutesDataset = routesDataSet => routes = routesDataSet;
    let getFields = (fields, obj) => {
        let obj_ = {};
        fields.forEach(field => obj_[field] = obj[field]);
        return obj_;
    };

    function getRoutes(fields = routeFields, selector = route => true) {

        return dBService.get('routes').then(routes => {
            return routes.filter(selector).map(route => getFields(fields, route));
        });
    }

    function getStops(fields = stopFields, selector = stop => true) {

        return dBService.get('stops').then(stops => {
            return stops.filter(selector).map(stop => getFields(fields, stop));
        });
    }

    function setRoutes(updates, selector) {

        let routes_ = [];
        // Assign updates to routes that meet selector condition
    	dBService.set('routes', updates).then(() => {
    		routes_ = routes.filter(selector).map(route => Object.assign(route, updates));
    	});

        return routes_;
    }


    function setStops(updates, selector) {

        let stops_ = [];
        // Assign updates to stops that meet selector condition
        dBService.set('stops', updates).then(() => {
            stops_ = routes.filter(selector).map(route => Object.assign(route, updates));
        });

        return stops_;
    }

    let data = {getStops, getRoutes, setRoutes,
        setStopsDataset, setRoutesDataset, stops, routes};

    return data;
}

export {dataService};
