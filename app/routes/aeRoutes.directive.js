'use strict';

aeRoutes.$inject = ['dataService', 'dBService'];

function aeRoutes(dataService, dBService) {

    let aeRoutes = {
        template: '<ae-menu-bar icon="menu" title="Routes" search="routes.search"></ae-menu-bar>' +
                  '<ae-route ng-repeat="route in routes.routes | limitTo: 100 | filter: {name: routes.search}"' +
                        'data-route="route" ></ae-route>',

        controller: controller,
        controllerAs: 'routes',
        scope: {},
        // link: link
    };

    return aeRoutes;

    function controller(dBService) {

        let vm = this;
        dBService.get('routes').then((routes) => vm.routes = routes);
    }

    // function link() {}
}

export {aeRoutes};
