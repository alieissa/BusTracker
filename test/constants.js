var STOPS_LIST = [{ "name":"Jockvale & Abetti","number":274,"code":"WA874",
       "lat":45.25885,"lon":-75.730598,"type":0,"favourite":0
   },
   {"name":"Marconi & Shirley's Brook","number":275,"code":"WM527",
       "lat":45.356106,"lon":-75.922829,"type":0,"favourite":0
}];

var ROUTES_LIST = [{
    "name":"Ottawa-Rockcliffe",
    "stops":"5726 BANK AND AD 2401\t6773 BANK AND AYLMER\t2414 BANK AND BELMONT\t8895 BANK AND CATHERINE SOUTH KEYS 1A",
    "favourite":0,"number":1,"id":1
},
{
    "name":"South Keys",
    "stops":"8441 1145 HUNT CLUB\t5727 BANK AND AD 2380\t7666 BANK AND ARLINGTON\t6774 BANK AND AYLMER\t6845 BANK AND CHAMBERLAIN",
    "favourite":0,"number":1,"id":2
}];

var OC_CONFIG_MOCK = {
  "APP_ID": "c618159f",
  "API_KEY": "77207661c5c94208c33fb2357efc7012"
};

var NEXT_TRIPS_FOR_STOP = {
    "GetNextTripsForStopResult": {
        "Error": "",
        "Route": {
            "RouteDirection": {
                "Direction": "Northbound",
                "Error": "",
                "RequestProcessingTime": "20161020021907",
                "RouteLabel": "Ottawa-Rockcliffe",
                "RouteNo": 1,
                "Trips": {
                    "Trip": [
                        {
                            "AdjustedScheduleTime": "1",
                            "AdjustmentAge": "0.67",
                            "BusType": "6EB - 60",
                            "GPSSpeed": "28.0",
                            "LastTripOfSchedule": true,
                            "Latitude": "45.413840",
                            "Longitude": "-75.695036",
                            "TripDestination": "Mackenzie King",
                            "TripStartTime": "26:05"
                        },
                        {
                            "AdjustedScheduleTime": "152",
                            "AdjustmentAge": "-1",
                            "BusType": "",
                            "GPSSpeed": "",
                            "LastTripOfSchedule": false,
                            "Latitude": "",
                            "Longitude": "",
                            "TripDestination": "Downtown / Centre-ville",
                            "TripStartTime": "04:30"
                        },
                        {
                            "AdjustedScheduleTime": "185",
                            "AdjustmentAge": "-1",
                            "BusType": "",
                            "GPSSpeed": "",
                            "LastTripOfSchedule": false,
                            "Latitude": "",
                            "Longitude": "",
                            "TripDestination": "Downtown / Centre-ville",
                            "TripStartTime": "05:03"
                        }
                    ]
                }
            }
        },
        "StopLabel": "BANK SOMERSET",
        "StopNo": "1902"
    }
}

var EXPECTED_NEXT_TRIPS_FOR_STOP = {
    "GetNextTripsForStopResult": {
        "Error": "",
        "Route": {
            "RouteDirection": [
              {
                "Direction": "Northbound",
                "Error": "",
                "RequestProcessingTime": "20161020021907",
                "RouteLabel": "Ottawa-Rockcliffe",
                "RouteNo": 1,
                "Trips": {
                    "Trip": [
                        {
                            "AdjustedScheduleTime": "1",
                            "AdjustmentAge": "0.67",
                            "BusType": "6EB - 60",
                            "GPSSpeed": "28.0",
                            "LastTripOfSchedule": true,
                            "Latitude": "45.413840",
                            "Longitude": "-75.695036",
                            "TripDestination": "Mackenzie King",
                            "TripStartTime": "26:05"
                        },
                        {
                            "AdjustedScheduleTime": "152",
                            "AdjustmentAge": "-1",
                            "BusType": "",
                            "GPSSpeed": "",
                            "LastTripOfSchedule": false,
                            "Latitude": "",
                            "Longitude": "",
                            "TripDestination": "Downtown / Centre-ville",
                            "TripStartTime": "04:30"
                        },
                        {
                            "AdjustedScheduleTime": "185",
                            "AdjustmentAge": "-1",
                            "BusType": "",
                            "GPSSpeed": "",
                            "LastTripOfSchedule": false,
                            "Latitude": "",
                            "Longitude": "",
                            "TripDestination": "Downtown / Centre-ville",
                            "TripStartTime": "05:03"
                        }
                    ]
                }
            }
          ]
        },
        "StopLabel": "BANK SOMERSET",
        "StopNo": "1902"
    }
}
var OC_CALL_RES_EMPTY_MOCK = {
    "GetRouteSummaryForStopResult": {
        "Error": "",
        "Routes": [],
        "StopDescription": "2591 QUEENSVIEW",
        "StopNo": "4000"
    }
}

var OC_CALL_RES_MOCK = {
    "GetRouteSummaryForStopResult": {
        "Error": "",
        "Routes": {
            "Route": [
                {
                    "Direction": "Outbound",
                    "DirectionID": 1,
                    "RouteHeading": "Kanata",
                    "RouteNo": 61
                },
                {
                    "Direction": "Southbound",
                    "DirectionID": 0,
                    "RouteHeading": "Hope Side",
                    "RouteNo": 164
                },
                {
                    "Direction": "Southbound",
                    "DirectionID": 0,
                    "RouteHeading": "Bridlewood",
                    "RouteNo": 168,
                    "Trips": [
                        {
                            "AdjustedScheduleTime": "184",
                            "AdjustmentAge": "-1",
                            "BusType": "",
                            "GPSSpeed": "",
                            "LastTripOfSchedule": false,
                            "Latitude": "",
                            "Longitude": "",
                            "TripDestination": "Bridlewood",
                            "TripStartTime": "05:30"
                        },
                        {
                            "AdjustedScheduleTime": "214",
                            "AdjustmentAge": "-1",
                            "BusType": "",
                            "GPSSpeed": "",
                            "LastTripOfSchedule": false,
                            "Latitude": "",
                            "Longitude": "",
                            "TripDestination": "Bridlewood",
                            "TripStartTime": "06:00"
                        }
                    ]
                },
                {
                    "Direction": "Westbound",
                    "DirectionID": 1,
                    "RouteHeading": "Kanata",
                    "RouteNo": 665
                }
            ]
        },
        "StopDescription": "EAGLESON PALOMINO",
        "StopNo": "1314"
    }
}

var GET_STOP_SUMMARY_RESULT = {
    "GetRouteSummaryForStopResult": {
        "Error": "",
        "Routes": [
                {
                    "Direction": "Outbound",
                    "DirectionID": 1,
                    "RouteHeading": "Kanata",
                    "RouteNo": 61,
                    "Trips": []
                },
                {
                    "Direction": "Southbound",
                    "DirectionID": 0,
                    "RouteHeading": "Hope Side",
                    "RouteNo": 164,
                    "Trips": []
                },
                {
                    "Direction": "Southbound",
                    "DirectionID": 0,
                    "RouteHeading": "Bridlewood",
                    "RouteNo": 168,
                    "Trips": [
                        {
                            "AdjustedScheduleTime": "184",
                            "AdjustmentAge": "-1",
                            "BusType": "",
                            "GPSSpeed": "",
                            "LastTripOfSchedule": false,
                            "Latitude": "",
                            "Longitude": "",
                            "TripDestination": "Bridlewood",
                            "TripStartTime": "05:30"
                        },
                        {
                            "AdjustedScheduleTime": "214",
                            "AdjustmentAge": "-1",
                            "BusType": "",
                            "GPSSpeed": "",
                            "LastTripOfSchedule": false,
                            "Latitude": "",
                            "Longitude": "",
                            "TripDestination": "Bridlewood",
                            "TripStartTime": "06:00"
                        }
                    ]
                },
                {
                    "Direction": "Westbound",
                    "DirectionID": 1,
                    "RouteHeading": "Kanata",
                    "RouteNo": 665,
                    "Trips": []
                }
        ],
        "StopDescription": "EAGLESON PALOMINO",
        "StopNo": "1314"
    }
}
