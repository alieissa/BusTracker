import {StopDetailCtrl} from './stop-detail.controller.js';
import {stopsService} from './stops.service.js';
import {stopsConfig} from './stops.config.js';
import {nextTrips} from './stops.directives.js';
import {aeStop, aeStops, nextTripsError} from './stops.directives.js';
// import {dBMod} from '../database/database.module.js';

angular.module('stopsMod', [])
.config(stopsConfig)
.controller('StopDetailCtrl', StopDetailCtrl)
.directive('nextTrips', nextTrips)
.directive('nextTripsError', nextTripsError)
.directive('aeStop', aeStop)
.directive('aeStops', aeStops)
.service('stopsService', stopsService);

export default angular.module('stopsMod');
