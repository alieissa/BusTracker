
import {FavesCtrl} from './favourites.controller.js';
import {aeFavesList} from './favourites.directives.js';
import {favesConfig} from './favourites.config.js';
import {dBMod} from '../database/database.module.js';
import {routesMod} from '../routes/routes.module.js';
import {stopsMod} from '../stops/stops.module.js';
// import {favesService} from './favourites.service.js';

angular.module('favesMod', [
        'dBMod',
        'ngRoute',
        'routesMod',
        'stopsMod'
    ])
    .config(favesConfig)
    .controller('FavesCtrl', FavesCtrl)
    .directive('aeFavesList', aeFavesList)

export default angular.module('favesMod')
