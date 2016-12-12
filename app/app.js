'use strict';

import {app_database} from './database/database.module.js';
import {app_faves} from './favourites/favourites.module.js';
import {app_nearby} from './nearby/nearby.module.js'
import {app_routes} from './routes/routes.module.js';
import {app_stops} from './stops/stops.module.js';
import {app_util} from './util/util.module.js';

let _mods = ['ngRoute', 'app_database', 'app_faves', 'app_routes', 'app_stops',
                'app_util', 'app_nearby' ];

angular.module('busTrackerApp', _mods)
    .config(config)
    .controller('MainCtrl', MainCtrl)
    .constant('config', {OC_URL: 'http://localhost:3000/v1.2'})
    .constant("OC", {
        APP_ID: "c618159f",
        API_KEY: "77207661c5c94208c33fb2357efc7012"
    })

function config($routeProvider, $httpProvider, oCServiceProvider, dBServiceProvider, OC) {

    dBServiceProvider.setDB(window.db);

    oCServiceProvider.setHttpOptions({
        url: window.url,
        appId: OC.APP_ID,
        apiKey: OC.API_KEY,
        httpConfig: {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
        }
    });

    $routeProvider
        .when('/', {
                template: '<ul>' +
                            '<li class="ae-menu-item"><a ng-href="#/routes">Routes</a></li> ' +
                            '<li class="ae-menu-item"><a ng-href="#/stops">Stops</a></li>' +
                            '<li class="ae-menu-item"><a ng-href="#/favourites">Favourites</a></li>' +
                            '<li class="ae-menu-item"><a ng-href="#/nearby">Nearby</a></li>' +
                        '</ul>',

            controller: 'MainCtrl',
            controllerAs: 'main'
        })
        .otherwise({
            redirectTo: '/'
        });
}

MainCtrl.$inject = ['$rootScope', 'dataService']
function MainCtrl($rootScope, dataService) {

    $rootScope.$on('$routeChangeError', (event, prev, next) => {
        console.log(`Unable to reach ${next}`);
    });
}
