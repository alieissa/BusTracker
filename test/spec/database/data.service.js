var dBService;
var dataService;

describe('Service: dataService', function() {

    beforeEach(module('dBMod'));
    beforeEach(inject(_inject));

    function _inject(_dBService_, _dataService_) {
        dBService = _dBService_;
        dataService = _dataService_;
    }

    describe('Method: setRoutesDataSet', setRouteDataSetTest);

    describe('Method: setStopsDataSet', setStopsDataSetTest);

    describe('Method: getStops', getStopsTest);

    describe('Method: getRoutes', getRoutesTest);

    describe('Method: setRoutes', setRoutesTest);

});

function setStopsDataSetTest() {

    var _stops = STOPS_LIST;

    it('Should have dataService.setStopsDataset defined', function() {
        expect(typeof dataService.setStopsDataset).toBe('function');
    });

    it('Should set stops to stops list', function() {

        dataService.setStopsDataset(_stops)
        stops = dataService.getStops();
        expect(stops).toEqual(_stops);
    });
};

function setRouteDataSetTest() {

    var _routes = ROUTES_LIST;
    it('Should have dataService.setRoutesDataset defined', function() {
        expect(typeof dataService.setRoutesDataset).toBe('function');
    });

    it('setRoutesDataset(routes) should set routes to routes list', function() {
        dataService.setRoutesDataset(_routes)
        routes = dataService.getRoutes();
        expect(routes).toEqual(_routes);
    })
}

function getStopsTest() {
    var stops;
    beforeEach(inject(function() {
        stops = STOPS_LIST
        dataService.setStopsDataset(STOPS_LIST);
    }));

    it('getStops should be defined as a function', function() {
        expect(typeof dataService.getStops).toBe('function');
    });

    it('getStops() should get all stops', function() {
        expect(dataService.getStops()).toEqual(STOPS_LIST);
    });

    it('getStops(["name"]) should get all stop names', function() {

        var _stops = dataService.getStops(['name']);
        var nonNameKeys = _stops.map(stop => Object.keys(stop).toString())
            .filter(key => key !== 'name')

        expect(nonNameKeys.length).toEqual(0);
    });

    it('getStops(["name"], stop => stop.code === "ZZZZ") should return []', function() {

        var _stops = dataService.getStops(['name'], stop => stop.code === "ZZZZ");
        expect(_stops).toEqual([]);
    });
}
function setRoutesTest() {

    it('Should set route favourite status to new value');
    it('Should set stop favourite status to new value');
}

function getRoutesTest() {

    var routes;
    beforeEach(inject(function() {
        routes = ROUTES_LIST;
        spyOn('get', dBService)
        dataService.setRoutesDataset(ROUTES_LIST);
    }));

    it('Should be defined as a function', function() {
        expect(typeof dataService.getRoutes).toBe('function');
    });

    it('getRoutes() should get all routes', function() {
        expect(dataService.getRoutes()).toEqual(ROUTES_LIST);
    });

    it('getRoutes(["name"]) should get all route names', function() {

        var _routes = dataService.getRoutes(['name']);
        var nonNameKeys = _routes.map(route => Object.keys(route).toString())
            .filter(key => key !== 'name')

        expect(nonNameKeys.length).toEqual(0);
    });

    it('getRoutes(["name"], stop => stop.code === "ZZZZ") should return []', function() {

        var _routes = dataService.getRoutes(['name'], stop => stop.code === "ZZZZ");
        expect(_routes).toEqual([]);
    });

}
