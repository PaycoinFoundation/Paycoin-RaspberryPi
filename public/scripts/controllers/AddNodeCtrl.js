'use strict';

angular.module('PaycoinRpiWallet')
    .controller('AddNodeCtrl', function ($scope, $rootScope, $http) {
        $rootScope.app.curTitle = "Add Node";

        $scope.newnode = {};

        $scope.addNode = function() {
            $http.post('/api/addnode', $scope.newnode)
                .then(function (response) {
                    if(response.data.error)
                        $scope.error = response.data.error;
                    console.log(response);
                })
        }
    }
);
