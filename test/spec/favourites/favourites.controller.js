
describe('Controller: FavesCtrl', function() {

    var faveRoutes = {};
    var faveStops = {};

    var FavesCtrl;
    var _inject = function($controller) {

        FavesCtrl = new $controller('FavesCtrl', {
            faveRoutes: faveRoutes,
            faveStops: faveStops
        });
    };
    
    beforeEach(module('favesMod'));
    beforeEach(inject(_inject));

    it('Should set routes to injected fave routes', function() {
        expect(FavesCtrl.routes).toEqual(faveRoutes);
    });

    it('Should set stops to injected fave stops', function() {
        expect(FavesCtrl.stops).toEqual(faveStops);
    });
})
