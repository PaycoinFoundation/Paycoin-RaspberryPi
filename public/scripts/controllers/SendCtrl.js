'use strict';

angular.module('PaycoinRpiWallet')
    .controller('SendCtrl', function ($scope, $rootScope, $localStorage, $http, paycoind) {

        $scope.send = {};

        $rootScope.app.curTitle = "Send Coins";

        $scope.chosenServer = $localStorage.chosenServer;

        $scope.getAddressBook = function(){
            $http.get('/api/getaddressbook')
                .then(function(response){
                    console.log(response.data);
                    $scope.addresses = response.data;
                })
        };

        $scope.accounts = $localStorage.accounts;

        $scope.getAddressBook();

        $scope.sendTo = function(add){
            console.log(add.address + " clicked");
            $scope.send.paycoinaddress = add.address;
            $scope.address_label = add.label;
        };

        $scope.sendcoin = function(){

            // TODO: refactor to flatten nested promises

            if($localStorage.chosenServer.locked == true){
                console.log("chosenServer locked");
                console.log($scope.send);
                if($localStorage.chosenServer.stakingOnly){
                    paycoind.walletLock();
                }
                paycoind.unlock($scope.send.passphrase, 15, false)
                    .then(function(response){
                        console.log("unlock response");
                        console.log(response);
                        paycoind.sendToAddress($scope.send)
                            .then(function(response){
                                console.log("sendToAddress response");
                                console.log(response);
                                if(!response.code) {
                                    $scope.successful_txid = response;
                                } else {
                                    $scope.error_code = response.code;
                                }
                                paycoind.walletLock()
                                    .then(function(){
                                        if($localStorage.chosenServer.stakingOnly) {
                                            paycoind.unlock($scope.send.passphrase, 32140800, true)
                                                .then(function (response) {
                                                    console.log("unlock response");
                                                    console.log(response);

                                                    if (response.data.error) {
                                                        $scope.error = response.data.error.msg;
                                                    } else {
                                                        $scope.success = true;
                                                    }

                                                })
                                        }
                                    });
                            });
                    })
            } else {
                console.log("chosenServer not locked");
                paycoind.sendToAddress($scope.send)
                    .then(function(response){
                        console.log(response);
                        if(!response.code) {
                            $scope.successful_txid = response;
                        } else {
                            $scope.error_code = response.code;
                        }
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
                .then(function(){
                    $scope.getAddressBook();
                });
        };

        paycoind.listAccounts()
            .then(function (response) {
                $scope.accounts = response;
                $localStorage.accounts = response;
                $localStorage.accounts.serverIndex = $localStorage.chosenServerIndex;
            });

        $scope.$watch('send.amount', function(newVal, oldVal){
            if(newVal == "!"){
                $scope.send.amount = $rootScope.getInfo.balance;
            }
        });

        $scope.$watch($localStorage.accounts, function(){
            $scope.accounts = $localStorage.accounts;
        });
    }
);
