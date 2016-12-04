'use strict';

aeRouteTripsCard.inject = ['dBService'];

function aeRouteTripsCard(dBService) {

    let aeRouteTripsCard = {
        templateUrl: 'partials/route-trips-card.html',
        scope: {
            route: '=',
            trips: '=',
        },
        // controller: controller,
        link: link
    }

    return aeRouteTripsCard;

    // function controller() {}

    function link(scope, element, attrs) {
        // angular.element('.material-icons').click(() => {
        //     //
        // })
    }
}
export {aeRouteTripsCard};
