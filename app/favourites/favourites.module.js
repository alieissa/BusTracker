
import {FavesCtrl} from './favourites.controller.js';
import {aeFaves} from './favourites.directives.js';
import {favesConfig} from './favourites.config.js';

angular.module('favesMod', [])
    .config(favesConfig)
    .controller('FavesCtrl', FavesCtrl)
    .directive('aeFaves', aeFaves)

export default angular.module('favesMod')
