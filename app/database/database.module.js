'use strict';

import {dBService} from './database.service.js';

angular.module('dBMod', [])
	.constant('DATABASE', 'octranspo')
	.factory('dBService', dBService);

export default angular.module('dBMod')
