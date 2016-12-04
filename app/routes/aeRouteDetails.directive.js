aeRouteDetails.$inject = ['$location', '$route', 'dBService'];
aeRouteDetailsCtrl.$inject = ['$routeParams', 'dBService'];

function aeRouteDetails($location, $route, dBService) {

    let aeRouteDetails = {
        template:
                '<ae-tall-menu-bar icon="arrow_back" title-heading="{{route.routeDetails.number}}" title={{route.routeDetails.name}} search=route.search>' +
                '</ae-tall-menu-bar>' +
                '<ae-stop ng-repeat="stop in route.routeDetails.stops | filter: {number: route.search}" data-stop="stop">' +
                '</ae-stop>',

        scope: {},
        bindToController: true,
        controller: 'aeRouteDetailsCtrl',
        controllerAs: 'route',
        // link: link
    };

    return aeRouteDetails;
}

function aeRouteDetailsCtrl($routeParams, dBService) {

    let vm = this;

    // Get route details from database
    dBService.getStops({id: $routeParams.id}).then((details) => vm.routeDetails = details);
}

export {aeRouteDetails, aeRouteDetailsCtrl};
