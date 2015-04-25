'use strict';

angular.module('PaycoinRpiWallet')
    .controller('TransactionsCtrl', function ($scope, $rootScope) {
        $rootScope.app.curTitle = "Transactions";
    }
);
