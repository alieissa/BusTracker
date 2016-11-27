'use strict';

aeRoute.inject = ['dBService'];
aeRoutes.inject = ['dBService'];
aeRouteDetails.inject = ['$location', '$route', 'dBService'];
aeRouteTripsCard.inject = ['dBService'];

function aeRoutes(dBService) {

    let aeRoutes = {
        template: '<ae-menu-bar icon="menu" title="Routes" search="routes.search"></ae-menu-bar>' +
                  '<ae-route ng-repeat="route in routes.routes | limitTo: 100 | filter: {name: routes.search}"' +
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
            dBService.set('routes', {favourite:_favourite}, {name: scope.route.name}).then(updateRoute);
        }

        function updateRoute(result) {

            // toggle favourite status
            scope.route.favourite = scope.route.favourite === 0 ? 1 : 0;

            // Set the favourite status indicator
            let starType = scope.route.favourite === 0 ? 'star_border' : 'star';
            star.text(starType);
        }
    }
}

function aeRouteDetails($location, $route, dBService) {

    let aeRouteDetails = {
        template:  '<ae-tall-menu-bar icon="arrow_back" title={{route.title}} search=route.search></ae-tall-menu-bar>' +
                  '<ae-stop ng-repeat="stop in route.routeDetails.stops | filter: {number: route.search}" ' +
                    'data-stop="stop"></ae-stop>',
        scope: {},
        bindToController: true,
        controller: controller,
        controllerAs: 'route',
        link: link
    };

    return aeRouteDetails;

    function controller() {

        let vm = this;

        // route id
        let id = $route.current.params.id;

        // Get route details from database
        dBService.getStops({id: id}).then((details) => {

            vm.routeDetails = details;
            vm.title = details.name;
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
        // angular.element('.material-icons').click(() => {
        //     //
        // })
    }

}
export {aeRoute, aeRoutes, aeRouteDetails, aeRouteTripsCard};
