
function nearbyService() {

    return {isNearby}
}

function isNearby(location, stop) {

    // Earth's radius in km
    const R = 6373;
    let stopLat = (stop.lat) * Math.PI / 180;
    let locationLat = (location.lat) * Math.PI / 180;

    let dlon = (location.lon - stop.lon) * Math.PI /180;
    let dlat = (location.lat - stop.lat)* Math.PI /180;

    // haversine formula
    let hav = Math.pow(Math.sin(dlat/2), 2) + Math.cos(locationLat) * Math.cos(stopLat) * Math.pow(Math.sin(dlon/2), 2)
    let angle = 2 * Math.atan2( Math.sqrt(hav), Math.sqrt(1-hav) )
    let dis = R * angle;

    // distance between location and stop is less 500 m
    return dis <= 0.5
}
export {nearbyService}
