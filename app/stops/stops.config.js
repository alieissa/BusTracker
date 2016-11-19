'use strict';

stopsConfig.$inject = ['$routeProvider', '$firebaseRefProvider'];

function stopsConfig($routeProvider, $firebaseRefProvider) {

    $routeProvider
        .when('/stops', {
            templateUrl: 'views/stops.html',
            controller: 'StopsCtrl',
            controllerAs: 'stops',
            resolve: {
                stopsList: (dBService) => dBService.getAll('stops')
            }
        })
        .when('/stops/:stopNo', {
            templateUrl: 'views/stop.html',
            controller: 'StopDetailCtrl',
            controllerAs: 'stop',
            resolve: {
                getFaveStatus: (dBService) => dBService.getFaveStatus,
                setFaveStatus: (dBService) => dBService.setFaveStatus,
                nextTrips: ($route, stopsService) => {

                    let stopNo = $route.current.params.stopNo;
                    return stopsService.getNextTrips(stopNo);
                }
            }
        });

}

export {stopsConfig};
