'use strict';

import {dBService} from './database.service.js';
import {OCService} from './OC.service.js';
import {dataService} from './data.service.js';

angular.module('dBMod', [])
	.constant('DATABASE', 'octranspo')
	.provider('OCService', OCService)
	.provider('dBService', dBService)
	.factory('dataService', dataService);

export default angular.module('dBMod')
