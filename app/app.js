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

function config($routeProvider, $httpProvider) {

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
            controllerAs: 'main'
        })
        // .otherwise({
        //     redirectTo: '/'
        // });
}

function MainCtrl($rootScope) {

    $rootScope.$on('$routeChangeError', (event, prev, next) => {
        console.log(`Unable to reach ${next}`);
    });
}
