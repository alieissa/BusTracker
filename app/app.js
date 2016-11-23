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
            templateUrl: 'views/main.html',
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
