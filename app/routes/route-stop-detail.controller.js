'use strict';

RouteStopDetailCtrl.$inject = ['details', 'getFaveStatus', 'setFaveStatus'];

function RouteStopDetailCtrl(details, getFaveStatus, setFaveStatus) {

	let vm = this;

	vm.showError = details.Error === '' ? false : true;
	vm.error = details.Error;

	vm.stopName = details.stopName;
	vm.stopNo = details.stopNo;
	vm.name = details.name;
	vm.trips = details.Trips;
	vm.details = details;
	vm.setFaveStatus = _setFaveStatus;

	// details doesn't include stop faveStatus
	getFaveStatus('number', vm.stopNo).then((faveStatus) => {
		vm.faveStatus = faveStatus;
	});

	function _setFaveStatus() {

		vm.faveStatus = vm.faveStatus === 0 ? 1 : 0;
		setFaveStatus(vm.faveStatus, 'number', vm.stopNo);
	}
}

export {RouteStopDetailCtrl};
