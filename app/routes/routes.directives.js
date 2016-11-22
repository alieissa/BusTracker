
aeRoute.inject = ['dBService'];

function aeRoute(dBService) {

    let aeRoute = {
        templateUrl: 'views/route.html',
        controller: controller,
        controllerAs: 'route',
        scope: {
            route: '='
        },
        link: link
    };

    return aeRoute;

    function controller() {

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

export {aeRoute};
