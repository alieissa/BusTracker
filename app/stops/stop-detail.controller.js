'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:StopDetailCtrl
 * @description
 * # StopDetailCtrl
 * Controller of the busTrackerApp
 */


StopDetailCtrl.$inject = ['$routeParams', 'routeDetails', 'stopDetails', 'setFaveStatus'];

function StopDetailCtrl($routeParams, routeDetails, stopDetails, setFaveStatus) {

    let vm = this;

    vm.name = stopDetails[0].name;
    vm.number = stopDetails[0].number;
    vm.code = stopDetails[0].code;
    vm.lat = stopDetails[0].lat;
    vm.lon = stopDetails[0].lon;
    vm.favourite = stopDetails[0].favourite;

    vm.error = routeDetails.error;
    vm.routes = routeDetails.routes;
    vm.setFaveStatus = _setFaveStatus;

    function _setFaveStatus(number) {

        let _favourite = vm.favourite === 0 ? 1 : 0;
        setFaveStatus('stops', {'favourite': _favourite}, {'number': number})
            .then(() => {
                vm.favourite = _favourite;
                console.log(_favourite);
            });

    }
}

export {StopDetailCtrl};
