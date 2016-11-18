'use strict';

function favesList() {

    let favesList = {
        templateUrl: './views/faves-list.html',
        scope: {
            routes: '=faveRoutes',
            stops: '=faveStops'
        },
        link: link
    }

    return favesList;

    function link(scope, element, attrs) {

        angular.element('.tab-item').on('touchstart', handleTouch);

        function handleTouch() {

            if(angular.element(this).hasClass('.tab-active')) {
                return;
            }

            angular.element('.tab-active').removeClass('tab-active');
            angular.element(this).addClass('tab-active');

            return;
        }
    }

    return;
}

export {favesList}
