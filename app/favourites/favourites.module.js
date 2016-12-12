
import {favesConfig} from './favourites.config.js';
import {aeFaves} from './favourites.directives.js';

angular.module('app_faves', [])
    .config(favesConfig)
    .directive('aeFaves', aeFaves);

export default angular.module('app_faves');
