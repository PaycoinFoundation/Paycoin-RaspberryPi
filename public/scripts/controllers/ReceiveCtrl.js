'use strict';

angular.module('PaycoinRpiWallet')
    .controller('ReceiveCtrl', function ($scope, $rootScope, $localStorage, paycoind) {
        $rootScope.app.curTitle = "Receive";

        paycoind.listAccounts()
            .then(function(response){
                console.log(response);
                $scope.accounts = response;
                $localStorage.accounts = response;
            })
    }
);
