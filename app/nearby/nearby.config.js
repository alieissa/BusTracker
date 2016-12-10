'use strict';

export function config($routeProvider) {
    $routeProvider.when('/nearby', {
        template: '<ae-nearby></ae-nearby>'
    });
}
