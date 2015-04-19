angular.module('app').factory('mockHttp', ['$timeout', '$q', function($timeout, $q) {
    return {
        get: function(url, fakeResponse, timeout) {
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve(fakeResponse);
            }, timeout);
            return deferred.promise;
        }
    };
}]);