'use strict';

import {aeMenuBar, aeTallMenuBar} from './util.directives.js';

angular.module('app_util', [])
    .directive('aeMenuBar', aeMenuBar)
    .directive('aeTallMenuBar', aeTallMenuBar);

export default angular.module('app_util');
