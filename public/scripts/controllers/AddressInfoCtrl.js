'use strict';

angular.module('PaycoinRpiWallet')
    .controller('AddressInfoCtrl', function ($scope, $rootScope,$stateParams, paycoind) {
        $rootScope.app.curTitle = "Address Info";

        $scope.address = $stateParams.address || "";

        paycoind.listAddressTransactions($scope.address)
            .then(function(response){
                console.log(response);
                $scope.listTransactions = response;
            })
    }
);
