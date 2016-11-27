'use strict';

function aeFaves(dBService) {

    let aeFaves = {
        templateUrl: './views/faves.html',
        controller: controller,
        controllerAs: 'faves',
        scope: true,
        link: link
    }

    return aeFaves;

    function controller(dBService) {

        let vm = this;

        vm.routes = [];
        vm.stops = [];

        dBService.get('routes', {'favourite': 1}).then((routes) => {vm.routes = routes});
        dBService.get('stops', {'favourite': 1}).then((stops) => {vm.stops = stops});

    }

    function link(scope, element, attrs) {
        // angular.element('.tab-item').click(handleClick);
        // function handleClick() {
        //
        //     if(angular.element(this).hasClass('tab-active')) {
        //         return;
        //     }
        //
        //     angular.element('.tab-active').removeClass('tab-active');
        //     angular.element(this).addClass('tab-active');
        //
        //     // console.log('Click on tab');
        // }

        angular.element('.tab-item').on('click', function() {

        	let targetDiv = angular.element(this).attr('id');
        	let contentDiv = `${targetDiv}-content`;
        	let otherDiv = contentDiv === 'stops-tab-content' ? 'routes-tab-content' : 'stops-tab-content'

        	angular.element(`#${contentDiv}`).css('display', 'block');
        	angular.element(`#${otherDiv}`).css('display', 'none');
        });
    }

    return;
}

export {aeFaves}
