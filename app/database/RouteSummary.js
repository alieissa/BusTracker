class RouteSummary {
    constructor() {
        {Direction, DirectionID, RouteHeading, RouteNo, Trips: _Trips} = Trip

        Trips = new Trips(_Trips);
    }
}

class TripsSummary {
    constructor(Trips) {
        let _Trips = typeof Trips.Trip === 'undefined' ? Trips : Trips.Trip;
        Trips = typeof Trips.Trip === 'undefined' ? _parseTrips(Trips) ? _parseTrips(Trips.Trip)
    }

    _parseTrips(Trips) {
        return Trips.filter((trip) => {
            typeof trip !== 'undefined';
        })
        .map((trip) => {
            // Clone trip into _trip
            let _trip = Object.assign({}, trip);
            return _trip;
        })
    }
}
