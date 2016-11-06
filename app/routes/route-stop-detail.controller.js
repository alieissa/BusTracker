'use strict';

RouteStopDetailCtrl.$inject = ['routeStopDetails'];

function RouteStopDetailCtrl(routeStopDetails) {
  
  let vm = this;
  
  vm.showError = routeStopDetails.Error === '' ? false : true;
  vm.error = routeStopDetails.Error;

  vm.routeStopDetails = routeStopDetails;

}

export {RouteStopDetailCtrl};
