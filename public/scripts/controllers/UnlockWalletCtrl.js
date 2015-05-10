'use strict';

angular.module('PaycoinRpiWallet')
    .controller('UnlockWalletCtrl', function ($scope, $rootScope, paycoind) {
        $rootScope.app.curTitle = "Unlock Wallet";

        $scope.unlock = function() {
            paycoind.unlock($scope.passphrase, $scope.duration)
                .then(function (response) {
                    console.log("unlock response");
                    console.log(response);

                    if(response.error){
                        $scope.error = response.error.msg;
                    } else {
                        $scope.success = true;
                    }

                })
        }
    }
);
