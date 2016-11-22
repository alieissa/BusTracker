'use strict';
aeStop.inject = ['dBService'];

function aeStop(dBService) {

    let aeStop = {
        templateUrl: 'views/stop.html',
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

export {aeStop, nextTrips, nextTripsError};
