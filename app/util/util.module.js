import {aeMenuBar, aeTallMenuBar} from './util.directives.js';

angular.module('appUtil', [])
    .directive('aeMenuBar', aeMenuBar)
    .directive('aeTallMenuBar', aeTallMenuBar);

export default angular.module('appUtil');
