var app = angular.module('app', ['leaflet-directive']);

app.controller('MainCtrl', ['$scope', '$http', 'leafletBoundsHelpers', function($scope, $http, leafletBoundsHelpers) {
    // uptown espresso in delridge
    // http://mygeoposition.com/
    var center = {
        lat: 47.5686120,
        lng: -122.3638430
    };

    var bounds = leafletBoundsHelpers.createBoundsFromArray([
        [ center.lat, center.lng ],
        [ center.lat, center.lng ]
    ]);

    angular.extend($scope, {
        bounds: bounds,
        center: {
            lat: center.lat,
            lng: center.lng,
            zoom: 15
        },
        defaults: {
            scrollWheelZoom: false
        }
    });

    $scope.nodes = []; // http://wiki.openstreetmap.org/wiki/Node
    $scope.ways = []; // http://wiki.openstreetmap.org/wiki/Way
    $scope.relations = []; // http://wiki.openstreetmap.org/wiki/Relation

    var url = 'http://overpass-api.de/api/interpreter?';
    var query = 'data=[out:json];(node(51.249,7.148,51.251,7.152);%3C;);out;';
    $http.get(url + query)
        .then(function(response) {
            console.log('response');
            console.log(response);
            var elements = response && response.data && response.data.elements;
            console.log(elements);
            if(elements && elements.length) {
                elements.map(function(element) {
                    if(element.type === 'node') {
                        $scope.nodes.push(element);
                    } else if(element.type == 'way') {
                        $scope.ways.push(element);
                    } else if(element.type === 'relation') {
                        $scope.relations.push(element);
                    } else {
                        // TODO I think there are only 'node', 'way', and 'relation'
                    }

                });
            }
        })
        .catch(function(error) {
            console.log('error');
            console.log(error);
        });
}])
    .filter('boundBox', function() {
        return function(input) {
            var northEast = input.northEast;
            var southWest = input.southWest;
            var display = "North East: (" + northEast.lat + ", " + northEast.lng + ")";
            display += "; South West: (" + southWest.lat + ", " + southWest.lng + ")";

            return display
        };
    });