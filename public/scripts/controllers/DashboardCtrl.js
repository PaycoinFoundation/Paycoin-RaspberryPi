'use strict';

angular.module('PaycoinRpiWallet')
    .controller('DashboardCtrl', function ($scope, $rootScope, $http, paycoind) {
        $rootScope.app.curTitle = "Dashboard";

        $scope.refreshInfo = function() {

            paycoind.getInfo()
                .then(function (response) {
                    $rootScope.getInfo = response;
                }
            )
        };

        paycoind.listTransactions()
            .then(function(response){
                $rootScope.listTransactions = response;
            });

        $scope.refreshInfo();
    }
);
