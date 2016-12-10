'use strict';

aeStop.$inject = ['dBService'];

function aeStop(dBService) {

    let aeStop = {
        templateUrl: 'partials/stop.directive.html',
        scope: {
            stop: '='
        },
        // controller: controller,
        controllerAs: 'stop',
        link: link
    };

    return aeStop;

    // function controller() {}

    function link(scope, element, attrs) {

        let star = element.find('i.star');

        star.on('click', handleStarTouch);

        function handleStarTouch() {

            let _favourite = scope.stop.favourite === 0 ? 1 : 0;
            dBService.set('stops', {favourite:_favourite}, {code: scope.stop.code}).then(updateStop);
        }

        function updateStop(result) {

            // toggle favourite status
            scope.stop.favourite = scope.stop.favourite === 0 ? 1 : 0;

            // Set the favourite status indicator
            let starType = scope.stop.favourite === 0 ? 'star_border' : 'star';
            star.text(starType);
        }
    }
}

export {aeStop};
