'use strict';

angular.module('PaycoinRpiWallet')
    .controller('TransactionsCtrl', function ($scope, $rootScope, $http, $localStorage, paycoind) {
        $rootScope.app.curTitle = "Transactions";

        paycoind.listAllTransactions()
            .then(function(response){
                $scope.transactions = response;
                $localStorage.transactions = response;
            });
    }
);
