'use strict';

angular.module('PaycoinRpiWallet')
    .controller('TransactionsCtrl', function ($scope, $rootScope, $http, $localStorage, paycoind) {
        $rootScope.app.curTitle = "Transactions";

        paycoind.listAllTransactions()
            .then(function(response){
                console.log("listAllTransactions()");
                console.log(response);
                $scope.transactions = response;
                $localStorage.transactions = response;
            });
    }
);
