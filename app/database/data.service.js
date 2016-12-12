'use strict';

dataService.$inject = ['dBService'];

function dataService(dBService) {

    let routes, stops;
    let routeFields = ['name','stops', 'favourite','number','id'];
    let stopFields = ['name','number','code','lat','lon','type','favourite'];

    let _getFields = (fields, obj) => {
        let obj_ = {};
        fields.forEach(field => obj_[field] = obj[field]);
        return obj_;
    };

    function getRoutes(fields = routeFields, selector = route => true) {

        return dBService.get('routes').then(routes => {
            return routes.filter(selector).map(route => _getFields(fields, route));
        });
    }

    function getStops(fields = stopFields, selector = stop => true) {

        return dBService.get('stops').then(stops => {
            return stops.filter(selector).map(stop => _getFields(fields, stop));
        });
    }

    function setRoutes(updates, selector) {
        return dBService.set('routes', updates);
    }

    function setStops(updates, selector) {
        return dBService.set('stops', updates)
    }

    return {getStops, getRoutes, setRoutes, stops, routes};
}

export {dataService};
