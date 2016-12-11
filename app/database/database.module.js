'use strict';

import {dataService} from './data.service.js';
import {dBService} from './database.service.js';
import {oCService} from './oC.service.js';

angular.module('dBMod', [])
    .constant('DATABASE', 'octranspo')
    .factory('dataService', dataService)
    .provider('dBService', dBService)
    .provider('oCService', oCService);

export default angular.module('dBMod');
