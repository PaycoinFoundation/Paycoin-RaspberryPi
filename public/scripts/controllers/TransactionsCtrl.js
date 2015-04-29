'use strict';

angular.module('PaycoinRpiWallet')
    .controller('TransactionsCtrl', function ($scope, $rootScope, $http, $localStorage) {
        $rootScope.app.curTitle = "Transactions";
        var payload = {"index":$rootScope.app.serverIndex};

        if(!$localStorage.listAccounts){
            $http.post('/api/listaccounts', payload)
                .then(function(response){
                    //console.log(response);
                    $localStorage.listAccounts = response.data.result;
                })
        }

        $http.post('/api/listtransactions', payload)
            .then(function(response){
                //console.log(response);
                $rootScope.listTransactions = response.data.result;
            })
    }
);
