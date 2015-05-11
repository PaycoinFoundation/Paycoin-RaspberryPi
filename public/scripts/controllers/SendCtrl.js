'use strict';

angular.module('PaycoinRpiWallet')
    .controller('SendCtrl', function ($scope, $rootScope, $localStorage, $http, paycoind) {

        $scope.send = {};

        $rootScope.app.curTitle = "Send Coins";

        $scope.getAddressBook = function(){
            $http.get('/api/getaddressbook')
                .then(function(response){
                    console.log(response.data);
                    $scope.addresses = response.data;
                })
        };

        $scope.getAddressBook();

        $scope.sendTo = function(add){
            console.log(add.address + " clicked");
            $scope.send.paycoinaddress = add.address;
            $scope.address_label = add.label;
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
                                $scope.successful_txid = response;
                                paycoind.walletlock();
                            });
                    })
            } else {
                console.log("chosenServer not locked");
                paycoind.sendToAddress($scope.send)
                    .then(function(response){
                        console.log(response);
                        $scope.successful_txid = response;
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
                    $scope.addresses = response.data;
                })
        };

        $scope.removeAddress = function(address){
            console.log("removing " + address.address);
            $http.post('/api/removeaddress', address)
                .then(function(response){
                    $scope.getAddressBook();
                });
        };

        $scope.$watch('send.amount', function(newVal, oldVal){
            if(newVal == "!"){
                $scope.send.amount = $rootScope.getInfo.balance;
            }
        });
    }
);
