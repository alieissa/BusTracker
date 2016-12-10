'use strict';

aeStops.$inject = ['dBService'];
function aeStops(dBService) {

    let aeStops = {
        template:
            '<ae-menu-bar icon="menu" title="Stops" search="stops.search"></ae-menu-bar>' +
            '<ae-stop ng-repeat="stop in stops.stops  | limitTo: stops.displayLimit | filter: {number: stops.search}" track by stop.number ' +
            'data-stop="stop"></ae-stop>',

        scope: {},
        controller: controller,
        bindToController: true,
        controllerAs: 'stops',
        link: link
    };

    return aeStops;

    function controller($scope, $window) {

        let vm = this;

        // Number of stops to display
        vm.displayLimit = 90;

        // Get all stops
        dBService.get('stops').then((stops) => vm.stops = stops);

        // Look for user scrolling
        angular.element($window).scroll(handleScroll);

        // When user scrolls increase displayed stops by 10
        function handleScroll() {

            if(vm.displayLimit > vm.stops.length) {
                return;
            }
            vm.displayLimit = vm.displayLimit + 10;
            // I know, tried very hard to get rid of $scope
            $scope.$apply();
        }
    }

    function link(scope, element, attrs) {
        // angular.element(window).scroll(() => {
        //     scope.stops.limit = scope.stops.limit + 50;
        //     console.log(scope.stops.limit);
        //     console.log('Scrolling');
        // });
    }
}

export {aeStops};
