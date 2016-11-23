
aeRoute.inject = ['dBService'];
aeRoutes.inject = ['dBService'];

function aeRoute(dBService) {

    let aeRoute = {
        templateUrl: 'views/route.directive.html',
        controller: controller,
        controllerAs: 'route',
        scope: {
            route: '='
        },
        link: link
    };

    return aeRoute;

    function controller(dBService) {

        let vm = this;
        dBService.get('routes').then((routes) => vm.routes = routes);
    }

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
        templateUrl: 'views/routes.directive.html',
        controller: controller,
        controllerAs: 'routes',
        scope: true,
        link: link
    };

    return aeRoutes;

    function controller(dBService) {

        let vm = this;
        dBService.get('routes').then((routes) => vm.routes = routes);
    }

    function link(scope, element, attrs) {

    }
}

export {aeRoute, aeRoutes};
