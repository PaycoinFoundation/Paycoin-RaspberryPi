'use strict';

angular.module('PaycoinRpiWallet')
    .controller('ReceiveCtrl', function ($scope, $rootScope, $localStorage, paycoind) {
        $rootScope.app.curTitle = "Receive";

        $scope.listaccounts = function() {
            paycoind.listAccounts()
                .then(function (response) {
                    $scope.accounts = response;
                    $localStorage.accounts = response;
                });
        };

        $scope.newReceiveAddress = function(label){
            paycoind.getNewAddress(label)
                .then(function(response){
                    console.log(response);
                    $scope.listaccounts();
                });
        };

        $scope.listaccounts();
    }
);
