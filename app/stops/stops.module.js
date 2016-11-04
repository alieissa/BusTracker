import {SQLiteMod} from '../common/SQLite.module.js';
import {StopsCtrl} from './stops.controller.js';
import {StopCtrl} from './stop-detail.controller.js';
import {stops} from './stops.service.js';
import {stopsConfig} from './stops.config.js';

angular.module('stopsMod', [
  'ngRoute',
  'firebase',
  'SQLiteMod'
])
.config(stopsConfig)
.controller('StopsCtrl', StopsCtrl)
.controller('StopCtrl', StopCtrl)
.service('stops', stops);

export default angular.module('stopsMod');
