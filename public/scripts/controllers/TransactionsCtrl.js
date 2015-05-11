'use strict';

angular.module('PaycoinRpiWallet')
    .controller('TransactionsCtrl', function ($scope, $rootScope, $http, $localStorage, $state, $stateParams, paycoind) {
        $rootScope.app.curTitle = "Transactions";

        paycoind.listAllTransactions()
            .then(function(response){
                $scope.transactions = response;
                $localStorage.transactions = response;
            });

        $state.reload = function reload() {
            $state.transitionTo($state.current, $stateParams, { reload: true, inherit: true, notify: true });
        };
    }
);
