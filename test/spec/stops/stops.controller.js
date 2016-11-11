'use strict';

var stopsList = [
    "1010 TERON",
    "1090 AMBLESIDE",
    "1145 HUNT CLUB",
    "1237 DUNNING RD",
    "1240 DUNNING RD",
    "1305 BASELINE",
    "1305 BASELINE"
];

describe('Controller: StopsCtrl', function () {

    var StopsCtrl;

    beforeEach(module('stopsMod'));
    beforeEach(inject(_inject));

    function _inject($controller) {
        StopsCtrl = $controller('StopsCtrl', { stopsList: stopsList });
    }

    it('Should set vm.stopsList to injected stopsList', function() {
      expect(StopsCtrl.stopsList).toEqual(stopsList);
    });
});
