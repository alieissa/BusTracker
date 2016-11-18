
function favesConfig($routeProvider) {

    $routeProvider.when('/favourites', {
        templateUrl: './views/faves.html',
        controller: 'FavesCtrl',
        controllerAs: 'faves',
        resolve: {
            faveRoutes: (dbService) => dbService.getFaves('routes'),
            faveStops: (dbService) => dbService.getFaves('stops')
        }
    })
}

export {favesConfig}
