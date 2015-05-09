'use strict';

angular.module('PaycoinRpiWallet')
    .controller('AddressbookCtrl', function ($scope, $rootScope, $http) {
        $rootScope.app.curTitle = "Address Book";

        $scope.getAddressBook = function(){
            $http.get('/api/getaddressbook')
                .then(function(response){
                    $scope.addresses = response.data;
                })
        };

        $scope.getAddressBook();

        // refactor into service!
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
        }
    }
);
