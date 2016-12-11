'use strict';

import {aeNearby} from './nearby.directive.js';
import {nearbyService} from './nearby.service.js';
import {nearbyConfig} from './nearby.config.js';

angular.module('app_nearby', [])
    .config(nearbyConfig)
    .directive('aeNearby', aeNearby)
    .factory('nearbyService', nearbyService);

export default angular.module('app_nearby');
