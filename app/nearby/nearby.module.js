import {nearbyService} from './nearby.service.js'
import {aeNearby} from './nearby.directive.js'
import {config} from './nearby.config.js'
angular.module('app_nearby', [])
    .config(config)
    .factory('nearbyService', nearbyService)
    .directive('aeNearby', aeNearby)


export default angular.module('app_nearby');
