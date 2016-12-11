'use strict';

aeNearby.$inject = ['dataService', 'nearbyService'];

function aeNearby() {

    let aeNearby_ = {
        template: '<ae-menu-bar icon="menu" title="Nearby" search="nearby.search"> </ae-menu-bar>' +
                    '<ae-stop ng-repeat="stop in nearby.stops | filter: {name: nearby.search}" stop="stop" ></ae-stop>',
        scope: { stops: '=' },
        controller: controllerFn,
        controllerAs: 'nearby'
    };
    return aeNearby_;
}

export {aeNearby};


function controllerFn(dataService, nearbyService) {

    let vm = this;
    let location = {lat: 45.431566, lon: -75.684647};

    let _selector = stop => nearbyService.isNearby(location, stop);
    let _fields = ['name', 'number', 'code', 'favourite', 'lat', 'lon'];
    dataService.getStops(_fields, _selector).then(stops => vm.stops = stops);
}
