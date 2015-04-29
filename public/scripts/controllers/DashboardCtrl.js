'use strict';

angular.module('PaycoinRpiWallet')
    .controller('DashboardCtrl', function ($scope, $rootScope, $http, paycoind) {
        $rootScope.app.curTitle = "Dashboard";
        $scope.amtRecent = 10;

        $scope.refreshInfo = function() {
            paycoind.getInfo()
                .then(function (response) {
                    $rootScope.getInfo = response;
                }
            );
            $scope.recentTransactions()
        };

        $scope.recentTransactions = function(){
            paycoind.listTransactions($scope.amtRecent)
                .then(function(response){
                    $rootScope.listTransactions = response;
                });
        };

        $scope.$watch('amtRecent', function(){
            $scope.recentTransactions()
        });

        $scope.refreshInfo();
    }
);
