'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:StopCtrl
 * @description
 * # StopCtrl
 * Controller of the busTrackerApp
 */

StopCtrl.$inject = ['$routeParams', 'stopRouteSummary', 'getFaveStatus', 'setFaveStatus'];

function StopCtrl($routeParams, stopRouteSummary, getFaveStatus, setFaveStatus) {

    let vm = this;

    vm.stopNo = $routeParams.stopNo;
    vm.showError = stopRouteSummary.Error !== '';
    vm.routes = vm.showError ? [] : stopRouteSummary.Routes;
    vm.stopDescription = stopRouteSummary.StopDescription;
    vm.setFaveStatus = _setFaveStatus;

    getFaveStatus('number', vm.stopNo).then((faveStatus) => {
        vm.faveStatus = faveStatus;
    });

    function _setFaveStatus(stopNo) {

        vm.faveStatus = vm.faveStatus === 0 ? 1 : 0;
        setFaveStatus(vm.faveStatus, 'number', stopNo);
    }
}

export {StopCtrl};
