// import {SQLiteMod} from '../common/SQLite.module.js';
import {StopsCtrl} from './stops.controller.js';
import {StopDetailCtrl} from './stop-detail.controller.js';
import {stopsService} from './stops.service.js';
import {stopsConfig} from './stops.config.js';

angular.module('stopsMod', [
      'ngRoute',
      'firebase',
      'dbMod'
])
.config(stopsConfig)
.controller('StopsCtrl', StopsCtrl)
.controller('StopDetailCtrl', StopDetailCtrl)
.service('stopsService', stopsService);

export default angular.module('stopsMod');
