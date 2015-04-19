var app = angular.module('app', ['leaflet-directive', 'angularSpinner']);

app.controller('MainCtrl', ['$scope', '$http', 'mockHttp', 'leafletBoundsHelpers', 'usSpinnerService', function($scope, $http, mockHttp, leafletBoundsHelpers, usSpinnerService) {
    initializeArrays();

    // uptown espresso in delridge
    // http://mygeoposition.com/
    var defaultCenter = {
        lat: 47.5686120,
        lng: -122.3638430
    };

    var bounds = leafletBoundsHelpers.createBoundsFromArray([
        [ defaultCenter.lat, defaultCenter.lng ],
        [ defaultCenter.lat - 0.2, defaultCenter.lng - 0.2]
    ]);

    angular.extend($scope, {
        bounds: bounds,
        center: {
            lat: defaultCenter.lat,
            lng: defaultCenter.lng,
            zoom: 15
        },
        defaults: {
            scrollWheelZoom: false
        }
    });

    $scope.$watch('bounds', function(newValue, oldValue) {
        console.log(newValue);
        $scope.searchEnabled = (newValue != oldValue);
    });

    $scope.startSpin = function(){
        usSpinnerService.spin('spinner-1');
    };

    $scope.stopSpin = function(){
        usSpinnerService.stop('spinner-1');
    };

    function initializeArrays() {
        $scope.nodes = []; // http://wiki.openstreetmap.org/wiki/Node
        $scope.ways = []; // http://wiki.openstreetmap.org/wiki/Way
        $scope.relations = []; // http://wiki.openstreetmap.org/wiki/Relation
    }

    var mockHttp

    $scope.requestOpenStreetMapData = function() {
        // start spinner
        $scope.startSpin();

        var commaSeperatedBounds = createCommaSeperatedBounds($scope.bounds);
        var urlBeginning = 'http://overpass-api.de/api/interpreter?';
        var query = 'data=[out:json];(node(' + commaSeperatedBounds + '););out;';
        var url = urlBeginning + query;

        // TODO make actual GET request
        initializeArrays();
        console.log('requesting new data');

        var mockResult = {
            data: {
                elements: [
                    {
                        type: 'node',
                        id: 1111,
                        lat: 2222,
                        lng: 3333
                    }
                ]
            }
        };
       // $http.get(url)
        // mock http request
        mockHttp.get(url, mockResult, 5000)
            .then(function(response) {
                $scope.searchEnabled = false;
                $scope.stopSpin();

                var elements = response && response.data && response.data.elements;
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
                $scope.stopSpin();

                console.log('error');
                console.log(error);
            });
    }

    function createCommaSeperatedBounds(bounds) {
        return bounds.southWest.lat + ',' + bounds.southWest.lng + ','  + bounds.northEast.lat + ',' +  bounds.northEast.lng;
    }
}]);
