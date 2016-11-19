'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:StopCtrl
 * @description
 * # StopCtrl
 * Controller of the busTrackerApp
 */

StopDetailCtrl.$inject = ['$routeParams', 'nextTrips', 'getFaveStatus', 'setFaveStatus'];

function StopDetailCtrl($routeParams, nextTrips, getFaveStatus, setFaveStatus) {

    let vm = this;

    vm = nextTrips;
    // vm.stopNo = nextTrips.StopNo;
    // vm.Error = nextTrips.Error;
    // vm.routes = nextTrips.Routes;
    // vm.stopDescription = nextTrips.StopDescription;
    vm.setFaveStatus = _setFaveStatus;

    getFaveStatus('number', vm.stopNo).then((faveStatus) => {
        vm.faveStatus = faveStatus;
    });

    function _setFaveStatus(stopNo) {

        vm.faveStatus = vm.faveStatus === 0 ? 1 : 0;
        setFaveStatus(vm.faveStatus, 'number', stopNo);
    }
}

export {StopDetailCtrl};
