
function favesConfig($routeProvider) {

    $routeProvider.when('/favourites', {
        templateUrl: './views/faves.html',
        controller: 'FavesCtrl',
        controllerAs: 'faves',
        resolve: {
            faveRoutes: (dBService) => dBService.getFaves('routes'),
            faveStops: (dBService) => dBService.getFaves('stops')
        }
    })
}

export {favesConfig}
