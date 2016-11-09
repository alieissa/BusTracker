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

  getFaveStatus(vm.stopNo).then((faveStatus) => {
    vm.faveStatus = faveStatus;
  });

  vm.setFaveStatus = function() {

    vm.faveStatus = vm.faveStatus === 1 ? 0 : 1;
    setFaveStatus(vm.stopNo, vm.faveStatus)
  }

}

export {RouteStopDetailCtrl};
