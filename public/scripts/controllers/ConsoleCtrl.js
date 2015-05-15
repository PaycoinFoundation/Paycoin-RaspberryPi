'use strict';

angular.module('PaycoinRpiWallet')
    .controller('ConsoleCtrl', function ($scope, $rootScope, $localStorage, paycoind) {
        $rootScope.app.curTitle = "Console... with Buttons!";

        $scope.checkWallet = function(){
            paycoind.checkWallet()
                .then(function(response){
                    $scope.checkWalletResponse = response.data;
                });
        };

        $scope.listUnspent = function(){
            paycoind.listUnspent()
                .then(function(response){
                    $scope.listUnspentResponse = response.data;
                })
        }
    }
);
