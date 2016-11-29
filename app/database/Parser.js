export class Parser {

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

    if(!Array.isArray(parseData.Routes)) {
        parseData.Routes = [parseData.Routes]
    }
    
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

    parseData.Routes = Parser.sortRoutesByTrips(parseData.Routes);

    return parseData.Routes;
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
