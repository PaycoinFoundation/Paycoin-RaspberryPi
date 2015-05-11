'use strict';

angular.module('PaycoinRpiWallet')
    .controller('TXIDCtrl', function ($scope, $rootScope, $stateParams, paycoind) {
        $rootScope.app.curTitle = "TXID Info";

        $scope.txid = $stateParams.txid;

        paycoind.getRawTransaction($scope.txid)
            .then(function(response){
                $scope.rawtrans = response.data;

                paycoind.decodeRawTransaction(response.data)
                    .then(function(response){
                        $scope.decodedtrans = response.data;
                    })

            });

        paycoind.getTransaction($scope.txid)
            .then(function(response){
                $scope.gettransaction = response.data;
            });
    }
);
