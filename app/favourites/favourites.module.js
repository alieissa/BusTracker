
import {FavesCtrl} from './favourites.controller.js';
import {favesList} from './favourites.directives.js';
import {favesConfig} from './favourites.config.js'
import {dBMod} from '../database/database.module.js'
// import {favesService} from './favourites.service.js';

angular.module('favesMod', [
        'dBMod',
        'ngRoute'
    ])
    .config(favesConfig)
    .controller('FavesCtrl', FavesCtrl)
    .directive('favesList', favesList)

export default angular.module('favesMod')
