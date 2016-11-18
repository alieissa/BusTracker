
import {FavesCtrl} from './favourites.controller.js';
import {favesList} from './favourites.directives.js';
import {favesConfig} from './favourites.config.js'
import {dbMod} from '../common/Model.js'
// import {favesService} from './favourites.service.js';

angular.module('favesMod', [
        'dbMod',
        'ngRoute'
    ])
    .config(favesConfig)
    .controller('FavesCtrl', FavesCtrl)
    .directive('favesList', favesList)

export default angular.module('favesMod')
