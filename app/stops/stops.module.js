// import {SQLiteMod} from '../common/SQLite.module.js';
import {StopsCtrl} from './stops.controller.js';
import {StopDetailCtrl} from './stop-detail.controller.js';
import {stopsService} from './stops.service.js';
import {stopsConfig} from './stops.config.js';
import {nextTrips} from './stops.directives.js';
import {nextTripsError} from './stops.directives.js';
import {dBMod} from '../database/database.module.js';

angular.module('stopsMod', [
      'ngRoute',
      'firebase',
      'dBMod'
])
.config(stopsConfig)
.controller('StopsCtrl', StopsCtrl)
.controller('StopDetailCtrl', StopDetailCtrl)
.directive('nextTrips', nextTrips)
.directive('nextTripsError', nextTripsError)
.service('stopsService', stopsService);

export default angular.module('stopsMod');
