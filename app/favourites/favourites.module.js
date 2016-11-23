
import {FavesCtrl} from './favourites.controller.js';
import {aeFavesList} from './favourites.directives.js';
import {favesConfig} from './favourites.config.js';

angular.module('favesMod', [])
    .config(favesConfig)
    .controller('FavesCtrl', FavesCtrl)
    .directive('aeFavesList', aeFavesList)

export default angular.module('favesMod')
