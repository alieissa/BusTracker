'use strict';

/**
 * @ngdoc overview
 * @name busTrackerApp
 * @description
 * # busTrackerApp
 *
 * Main module of the application.
 */
import {routesMod} from './routes/routes.module.js';
import {stopsMod} from './stops/stops.module.js';
import {SQLiteMod} from './common/SQLite.module.js';
angular
  .module('busTrackerApp', [
    'firebase',
    'ngRoute',
    'routesMod',
    'stopsMod',
    'SQLiteMod'
  ])
  .config(config)
  .controller('FavesCtrl', FavesCtrl)
  .controller('MainCtrl', MainCtrl);

function config($routeProvider, $httpProvider) {

  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.withCredentials = true;
  delete $httpProvider.defaults.headers.common["X-Requested-With"];

  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      controllerAs: 'main'
    })
    .when('/favourites', {
      templateUrl: 'views/favourites.html',
      controller: 'FavesCtrl',
      controllerAs: 'faves',
      resolve: {
        faveRoutes: function(dataService) {
          return dataService.getFaveRoutes();
        },

        faveStops: function(dataService) {
          return dataService.getFaveStops();
        }
      }
    })
    .otherwise({
      redirectTo: '/'
    });

}

function FavesCtrl(faveRoutes, faveStops) {
  
  let vm = this;
  
  vm.routes =  faveRoutes;
  vm.stops = faveStops;
}

function MainCtrl($rootScope) {

  $rootScope.$on('$routeChangeError', function(event, prev, next) {
    console.log('Gotcha');
    console.log(event);
    console.log(prev);
    console.log(next);
  });
}
