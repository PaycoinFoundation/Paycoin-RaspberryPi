'use strict';

angular.module('PaycoinRpiWallet')
    .controller('ReceiveCtrl', function ($scope, $rootScope, $localStorage, $state, $stateParams, paycoind) {
        $rootScope.app.curTitle = "Receive";

        $scope.listAccounts = function() {
            paycoind.listAccounts()
                .then(function (response) {
                    $scope.accounts = response;
                    $localStorage.accounts.serverIndex = $localStorage.chosenServerIndex;
                    $localStorage.accounts = response;
                });
        };

        $scope.listAccounts();

        $scope.newReceiveAddress = function(label){
            paycoind.getNewAddress(label)
                .then(function(response){
                    console.log(response);
                    $scope.listaccounts();
                });
        };

        $state.reload = function reload() {
            $state.transitionTo($state.current, $stateParams, { reload: true, inherit: true, notify: true });
        };
    }
);
