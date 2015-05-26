'use strict';

angular.module('PaycoinRpiWallet')
    .controller('LockWalletCtrl', function ($scope, $rootScope, $localStorage, paycoind) {
        $rootScope.app.curTitle = "Lock Wallet";

        $scope.walletLock = function() {

            $localStorage.chosenServer.locked = true;
            $localStorage.chosenServer.stakingOnly = false;

            paycoind.walletLock()
                .then(function (response) {
                    console.log(response);
                    $scope.response = response.data;
                })
        }
    }
);
