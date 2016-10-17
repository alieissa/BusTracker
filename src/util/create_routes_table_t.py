import csv
from firebase import firebase

FIREBASE_URL = "https://octranspo-a9250.firebaseio.com"
firebase = firebase.FirebaseApplication(FIREBASE_URL, None)

route_stops = {}

routes_file_path = 'routes.csv'
routes_file = open(routes_file_path, 'r');
routes = csv.reader(routes_file)

for route in routes:
    stops = route[1].split('\t') # stops are tsv
    for stop in stops:
        stop_code = stop.split(" ")[0] # get stop code from value
        stop_name = " ".join(stop.split(" ")[1:]) # separate stop name from stop code
        route_stops[stop_code] = stop_name

    try:
        result = firebase.put('/routes/' + route[0], "stops", route_stops, params={'print': 'pretty'})
        route_stops = {}
    except Exception as e:
        print e
