'use strict';

function aeFaves(dBService) {

    let aeFaves_ = {
        templateUrl: 'partials/faves.html',
        scope: true,
        controller: controllerFn,
        controllerAs: 'faves',
        link: linkFn
    };
    return aeFaves_;
}

export {aeFaves};


function controllerFn(dBService) {

    let vm = this;

    vm.routes = [];
    vm.stops = [];

    dBService.get('routes', {'favourite': 1}).then(routes => vm.routes = routes);
    dBService.get('stops', {'favourite': 1}).then(stops => vm.stops = stops);

}

function linkFn(scope, element, attrs) {

    angular.element('.tab-item').on('click', function() {

        // Target is already the active tab
        if(angular.element(this).hasClass('tab-active')) {
            return;
        }

        // Show clicked tab content
        let _targetTab = angular.element(this).attr('id');
        let _targetTabContent = `${_targetTab}-content`;
        angular.element(`#${_targetTabContent}`).css('display', 'block');
        angular.element(this).addClass('tab-active');

        // Hide prev tab content
        let _otherTab = _targetTab === 'stops-tab' ? 'routes-tab' : 'stops-tab';
        let _otherTabContent = `${_otherTab}-content`;
        angular.element(`#${_otherTabContent}`).css('display', 'none');
        angular.element(`#${_otherTab}`).removeClass('tab-active');
    });
}
