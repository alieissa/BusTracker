
describe('Service: dBService', function() {

    var dBService;

    beforeEach(module('dBMod'));
    beforeEach(inject(_inject));

    function _inject(_dBService_) {
        dBService = _dBService_;
    }

    it('Should have dBService.get defined', function() {
        expect(typeof dBService.get).toBe('function');
    });

    it('Should have dBService.set defined', function() {
        expect(typeof dBService.set).toBe('function');
    });

    it('Should have dBService.getStops defined', function() {
        expect(typeof dBService.getStops).toBe('function');
    });

    describe('dBService.get', function() {

        it('Should return all routes');
        it('Should return all stops');
        it('Should return all fave routes');
        it('Should return all fave stops');
        it('Should return specific route details');
        it('Should return specific stop details');

    });

    describe('dBService.set', function() {

        it('Should set route favourite status to new value');
        it('Should set stop favourite status to new value');
    });

    describe('dBService.getStops', function() {
        it('Should return all stops for specific route');
    });
});
