'use strict';
aeStop.inject = ['dBService'];
aeStops.inject = ['dBService'];

function aeStop(dBService) {

    let aeStop = {
        templateUrl: 'views/stop.directive.html',
        scope: {
            stop: '='
        },
        controller: controller,
        controllerAs: 'stop',
        link: link
    }

    return aeStop;

    function controller() {

    }

    function link(scope, element, attrs) {

        let star = element.find('i.star');

        star.on('click', handleStarTouch);

        function handleStarTouch() {

            let _favourite = scope.stop.favourite === 0 ? 1 : 0;
            dBService.set('stops', {favourite:_favourite}, {number: scope.stop.number}).then(updateStop);
        }

        function updateStop(result) {

            // toggle favourite status
            scope.stop.favourite = scope.stop.favourite === 0 ? 1 : 0;

            // Set the favourite status indicator
            let starType = scope.stop.favourite === 0 ? 'star_border' : 'star';
            star.text(starType);
        }

        console.log('Stop directive');
    }
}

function aeStops(dBService) {

    let aeStops = {
        template: '<ae-menu-bar title="Stops" ng-cloak></ae-menu-bar>' +
                  '<ae-stop ng-repeat="stop in stops.stops | limitTo: 100 | filter: {number: search}" ' +
                    'data-stop="stop"></ae-stop>',
        scope: {},
        controller: controller,
        controllerAs: 'stops',
        link: link
    };

    return aeStops;

    function controller() {

        let vm = this;
        dBService.get('stops').then((stops) => vm.stops = stops);
        // vm.stopsList = stopsList;
    }

    function link() {

    }

}
function nextTripsError() {

    let nextTripsError = {
        templateUrl: '/views/next-trips-error.html',
    }

    return nextTripsError;
}

function nextTrips() {

    let nextTrips = {
        templateUrl: '/views/next-trips.html',
        scope: {
            route: '=',
            trips: '='
        },
        link: (scope, element, attrs) => {
            angular.element('.material-icons').click(() => {
                console.log('Clicked icon ');
            })
            console.log('Next trips link function');
        }
    };

    return nextTrips;
}

export {aeStop, aeStops, nextTrips, nextTripsError};
