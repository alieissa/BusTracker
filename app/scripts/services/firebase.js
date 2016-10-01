'use strict';

/**
 * @ngdoc service
 * @name busTrackerApp.firebase
 * @description
 * # firebase
 * Provider in the busTrackerApp.
 */
angular.module('busTrackerApp')
  .provider('firebase', function () {

    // Private variables
    var salutation = 'Hello';

    // Private constructor
    function Greeter() {
      this.greet = function () {
        return salutation;
      };
    }

    // Public API for configuration
    this.setSalutation = function (s) {
      salutation = s;
    };

    // Method for instantiating
    this.$get = function () {
      return new Greeter();
    };
  });
