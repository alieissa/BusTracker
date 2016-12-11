'use strict';

function nearbyConfig($routeProvider) {

    $routeProvider.when('/nearby', {
        template: '<ae-nearby></ae-nearby>'
    });
}

export {nearbyConfig};
