'use strict';

import {dBService} from './database.service.js';
import {OCService} from './OC.service.js';

angular.module('dBMod', [])
	.constant('DATABASE', 'octranspo')
	.factory('OCService', OCService)
	.factory('dBService', dBService);

export default angular.module('dBMod')
