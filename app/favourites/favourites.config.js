
function favesConfig($routeProvider) {

    $routeProvider.when('/favourites', {
        templateUrl: './views/faves.html',
        controller: 'FavesCtrl',
        controllerAs: 'faves',
        resolve: {
            faveRoutes: (dBService) => dBService.get('routes', {'favourite': 1}),
            faveStops: (dBService) => dBService.get('stops', {'favourite': 1})
        }
    })
}

export {favesConfig}
