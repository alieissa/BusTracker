
import {aeFaves} from './favourites.directives.js';
import {favesConfig} from './favourites.config.js';

angular.module('favesMod', [])
    .config(favesConfig)
    .directive('aeFaves', aeFaves);

export default angular.module('favesMod');
