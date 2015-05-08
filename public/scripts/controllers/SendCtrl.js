'use strict';

angular.module('PaycoinRpiWallet')
    .controller('SendCtrl', function ($scope, $rootScope, $localStorage, $http, paycoind) {

        $scope.send = {};

        $rootScope.app.curTitle = "Send Coins";

        function getAddressBook(){
            $http.get('/api/getaddressbook')
                .then(function(response){
                    console.log(response.data);
                    $scope.addresses = response.data;
                })
        }

        getAddressBook();

        $scope.sendTo = function(address){
            console.log(address + " clicked");
            $scope.send.paycoinaddress = address;
        };

        $scope.sendcoin = function(){
            if($localStorage.chosenServer.locked == true){
                console.log("chosenServer locked");
                console.log($scope.send);
                paycoind.unlock($scope.send.passphrase, 60)
                    .then(function(response){
                        console.log("unlock response");
                        console.log(response);
                        paycoind.sendToAddress($scope.send)
                            .then(function(response){
                                console.log("sendToAddress response");
                                console.log(response);
                                paycoind.walletlock()
                            });
                    })
            } else {
                console.log("chosenServer not locked");
                paycoind.sendToAddress($scope.send)
                    .then(function(response){
                        console.log(response);
                    });
            }
        };

        $scope.addaddress = function(){
            var payload = {
                label: $scope.address_label,
                address: $scope.send.paycoinaddress
            };

            $http.post('/api/addtoaddressbook', payload)
                .then(function(response){
                    console.log(response);
                    $scope.addresses = response.data;
                })
        };

        $scope.removeAddress = function(address){
            console.log("removing " + address.address);
            $http.post('/api/removeaddress', address)
                .then(function(response){
                    console.log(response.data);
                });
        }
    }
);
