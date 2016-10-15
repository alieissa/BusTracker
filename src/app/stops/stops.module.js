import {StopsCtrl} from './stops.controller.js';
import {StopCtrl} from './stop-detail.controller.js';
import {stops} from './stops.service.js';
import {stopsConfig} from './stops.config.js';

angular.module('stopsMod', [
  'ngRoute',
  'firebase'
])

export default angular.module('stopsMod')
