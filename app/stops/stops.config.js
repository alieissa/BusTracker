'use strict';

stopsConfig.$inject = ['$routeProvider'];

function stopsConfig($routeProvider) {

    $routeProvider
        .when('/stops', {
            template: '<ae-stops></ae-stops>',
        })
        .when('/stops/:stopNo', {
            templateUrl: 'views/stop-details.html',
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
