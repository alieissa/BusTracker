export class OCData {
  constructor(hhmm) {
    let _hour = parseInt(hhmm.split(':')[0]);
    this.minute = parseInt(hhmm.split(':')[1]);
    this.hour = Math.floor(_hour%24); // For some reason OC Transpo has a clock that runs more than 24 hrs
  }

  diff(otherDate) {

    let thisDuration = (this.hour)*60 + this.minute;
    let otherDuration = (otherDate.hour) * 60 + otherDate.minute;

    return (otherDuration - thisDuration);
  }

  static readable(duration) {
    let hour = Math.floor(duration / 60);
    let minute = duration % 60;

    let duration_string = hour > 0 ? `In ${hour} hr ${minute} min` : `In ${minute} min`;
    return duration_string;
  }

  static parseRoutes(data) {

    let parseData = {
      "Error":data.Error,
      "Routes": data.Routes.Route,
      "StopDescription": data.StopDescription,
      "StopNo": data.StopNo

    };

    parseData.Routes.forEach((route, index, self) => {
      if(Array.isArray(route.Trips)) {
        return;
      }
      else if(typeof route.Trips === 'undefined') {
        route.Trips = [];
      }
      else {
          route.Trips = [route.Trips];
      }
    });

    parseData.Routes = OCData.sortRoutesByTrips(parseData.Routes);

    return parseData;
  }

  static sortRoutesByTrips(routes) {

    let _routesSchdeuled = [];
    let _routesUnscheduled = [];
    let _sortedRoutes = [];

    routes.forEach((route, index, self) => {
      if(route.Trips.length == 0) _routesUnscheduled.push(route);
      else {_routesSchdeuled.push(route);}
    })

    _sortedRoutes = _routesSchdeuled.concat(_routesUnscheduled);
    return _sortedRoutes
  }
}
