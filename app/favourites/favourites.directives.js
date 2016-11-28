'use strict';

function aeFaves(dBService) {

    let aeFaves = {
        templateUrl: 'partials/faves.html',
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
        
        angular.element('.tab-item').on('click', function() {

            // Target is already the active tab
            if(angular.element(this).hasClass('tab-active')) {
                return;
            }

        	let targetTab = angular.element(this).attr('id');
        	let targetTabContent = `${targetTab}-content`;
        	let otherTab = targetTab === 'stops-tab' ? 'routes-tab' : 'stops-tab'
            let otherTabContent = `${otherTab}-content`;

            // Show clicked tab content
        	angular.element(`#${targetTabContent}`).css('display', 'block');
            angular.element(this).addClass('tab-active');

            // Hide other content
        	angular.element(`#${otherTabContent}`).css('display', 'none');
            angular.element(`#${otherTab}`).removeClass('tab-active')
        });
    }

    return;
}

export {aeFaves}
