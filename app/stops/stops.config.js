'use strict';

stopsConfig.$inject = ['$routeProvider', '$firebaseRefProvider'];

function stopsConfig($routeProvider, $firebaseRefProvider) {

    $routeProvider
        .when('/stops', {
            templateUrl: 'views/stops.html',
            controller: 'StopsCtrl',
            controllerAs: 'stops',
            resolve: {
                stopsList: (stopsService) => stopsService.getAll()
            }
        })
        .when('/stops/:stopNo', {
            templateUrl: 'views/stop.html',
            controller: 'StopCtrl',
            controllerAs: 'stop',
            resolve: {
                getFaveStatus: (stopsService) => stopsService.getFaveStatus,
                setFaveStatus: (stopsService) => stopsService.setFaveStatus,
                stopRouteSummary: ($route, stopsService) => {

                    let stopNo = $route.current.params.stopNo;
                    return stopsService.getRouteSummary(stopNo);
                }
            }
        });

}

export {stopsConfig};
