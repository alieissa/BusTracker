'use strict';

/**
 * @ngdoc overview
 * @name busTrackerApp
 * @description
 * # busTrackerApp
 *
 * Main module of the application.
 */

 import {dBMod} from './database/database.module.js';
import {routesMod} from './routes/routes.module.js';
import {stopsMod} from './stops/stops.module.js';
import {favesMod} from './favourites/favourites.module.js';
import {appUtil} from './util/util.module.js';

angular.module('busTrackerApp', [
        'ngRoute',

        'dBMod',
        'favesMod',
        'routesMod',
        'stopsMod',
        'appUtil'
    ])
    .config(config)
    .constant('config', {OC_URL: 'http://localhost:3000/v1.2'})
    .controller('MainCtrl', MainCtrl);

function config($routeProvider, $httpProvider, OCServiceProvider, dBServiceProvider) {

    dBServiceProvider.setDB(window.db);

    OCServiceProvider.setHttpOptions({
        url: window.url,
        appId: window._env.OC.APP_ID,
        apiKey: window._env.OC.API_KEY,
        httpConfig: {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
        }
    });

    $routeProvider
        .when('/', {
            template:
                '<ul class="list-unstyled" style="list-style: none; background-color: grey; height: auto; margin-bottom: 0">' +
                    '<span style="color: white">' +
                        '<li style="float: left; width: 25%; text-align: center"><a ng-href="#/routes">Routes</a></li> ' +
                        '<li style="float: left; width: 25%; text-align: center"><a ng-href="#/stops">Stops</a></li>' +
                        '<li style="float: left; width: 25%; text-align: center"><a ng-href="#/favourites">Favourites</a></li>' +
                        '<li style="float: left; width: 25%; text-align: center"><a ng-href="#/nearby">Nearby</a></li>' +
                    '</span>' +
                '</ul>',

            controller: 'MainCtrl',
            controllerAs: 'main',
            resolve: {
                routes: (dBService) => dBService.get('routes'),
                stops: (dBService) => dBService.get('stops')
            }
        })
        // .otherwise({
        //     redirectTo: '/'
        // });
}

MainCtrl.inject = ['$rootScope', 'dataService', 'stops', 'routes']
function MainCtrl($rootScope, dataService, routes, stops) {

    dataService.setStopsDataset(stops);
    dataService.setRoutesDataset(routes);

    $rootScope.$on('$routeChangeError', (event, prev, next) => {
        console.log(`Unable to reach ${next}`);
    });
}
