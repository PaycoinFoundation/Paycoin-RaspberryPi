'use strict';

angular.module('PaycoinRpiWallet')
    .controller('SendCtrl', function ($scope, $rootScope, $localStorage, paycoind) {

        $rootScope.app.curTitle = "Send Coins";

        $scope.sendcoin = function(){

            if($localStorage.chosenServer.locked == true){
                console.log("chosenServer locked");
                console.log($scope.send);
                paycoind.unlock($scope.send.passphrase, 60)
                    .then(function(response){
                        console.log(response);
                        paycoind.sendToAddress($scope.send)
                            .then(function(response){
                                console.log(response);
                            });
                    })
            } else {
                console.log("chosenServer locked else");
                paycoind.sendToAddress($scope.send)
                    .then(function(response){
                        console.log(response);
                    });
            }


        };

        $scope.addaddress = function(address,label){

        }
    }
);
