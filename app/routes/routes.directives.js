'use strict';

aeRoute.inject = ['dBService'];
aeRoutes.inject = ['dBService'];
aeRouteDetails.inject = ['$location', 'dBService'];
aeRouteTripsCard.inject = ['dBService'];

function aeRoute(dBService) {

    let aeRoute = {
        templateUrl: 'views/route.directive.html',
        scope: {
            route: '='
        },
        // controller: controller
        link: link
    };

    return aeRoute;

    // function controller() {}
    
    function link(scope, element, attrs) {

        let star = element.find('i.star');

        star.on('click', handleStarTouch);

        function handleStarTouch() {

            let _favourite = scope.route.favourite === 0 ? 1 : 0;
            dBService.set('routes', {favourite:_favourite}, {name: scope.route.name}).then(updateStop);
        }

        function updateStop(result) {

            // toggle favourite status
            scope.route.favourite = scope.route.favourite === 0 ? 1 : 0;

            // Set the favourite status indicator
            let starType = scope.route.favourite === 0 ? 'star_border' : 'star';
            star.text(starType);
        }
    }
}

function aeRoutes(dBService) {

    let aeRoutes = {
        template: '<ae-menu-bar icon="menu" title="Routes" ng-cloak></ae-menu-bar>' +
                  '<ae-route ng-repeat="route in routes.routes | limitTo: 100 |filter: {name: search, number: search}"' +
                        'data-route="route" ></ae-route>',

        controller: controller,
        controllerAs: 'routes',
        scope: {},
        // link: link
    };

    return aeRoutes;

    function controller(dBService) {

        let vm = this;
        dBService.get('routes').then((routes) => vm.routes = routes);
    }

    // function link() {}
}

function aeRouteDetails($location, dBService) {

    let aeRouteDetails = {
        template:  '<ae-menu-bar icon="arrow_back" title={{route.title}}></ae-menu-bar>' +
                  '<ae-stop ng-repeat="stop in route.routeDetails.stops | limitTo: 100 | filter: {number: search}" ' +
                    'data-stop="stop"></ae-stop>',
        scope: {},
        controller: controller,
        controllerAs: 'route',
        link: link
    };

    return aeRouteDetails;

    function controller() {

        let vm = this;

        // Get route name from query string
        let name = ($location.search()).name;
        vm.title = name;

        // Get route details from database
        dBService.getStops({'name': name}).then((details) => {
            vm.routeDetails = details;
            // console.log(details);
        });
    }

    function link(scope, element, attrs) {

    }
}

function aeRouteTripsCard(dBService) {

    let aeRouteTripsCard = {
        templateUrl: '/views/route-trips-card.html',
        scope: {
            route: '=',
            trips: '=',
        },
        // controller: controller,
        link: link
    }

    return aeRouteTripsCard;

    // function controller() {}

    function link(scope, element, attrs) {
        angular.element('.material-icons').click(() => {
            console.log('Clicked icon ');
        })
        console.log('Route card link function');
    }


}
export {aeRoute, aeRoutes, aeRouteDetails, aeRouteTripsCard};
