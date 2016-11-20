'use strict';

stopsConfig.$inject = ['$routeProvider', '$firebaseRefProvider'];

function stopsConfig($routeProvider, $firebaseRefProvider) {

    $routeProvider
        .when('/stops', {
            templateUrl: 'views/stops.html',
            controller: 'StopsCtrl',
            controllerAs: 'stops',
            resolve: {
                stopsList: (dBService) => dBService.get('stops')
            }
        })
        .when('/stops/:stopNo', {
            templateUrl: 'views/stop.html',
            controller: 'StopDetailCtrl',
            controllerAs: 'stop',
            resolve: {
                setFaveStatus: (dBService) => dBService.set,
                stopDetails: ($route, dBService) => {

                    let stopNo = $route.current.params.stopNo;
                    return dBService.get('stops', {number: stopNo});
                },
                routeDetails: ($route, stopsService) => {

                    let stopNo = $route.current.params.stopNo;
                    return stopsService.getNextTrips(stopNo);
                }
            }
        });

}

export {stopsConfig};
