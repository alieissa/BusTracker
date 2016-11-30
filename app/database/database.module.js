'use strict';

import {dBService} from './database.service.js';
import {OCService} from './OC.service.js';

angular.module('dBMod', [])
	.constant('DATABASE', 'octranspo')
	.provider('OCService', OCService)
	.provider('dBService', dBService)

export default angular.module('dBMod')
