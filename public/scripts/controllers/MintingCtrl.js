'use strict';

angular.module('PaycoinRpiWallet')
    .controller('MintingCtrl', function ($scope, $rootScope, $localStorage, paycoind) {
        $rootScope.app.curTitle = "Minting";

        paycoind.listMinting()
            .then(function(response){
                $localStorage.listMinting = response;
                $rootScope.listMinting = response;
            });
    }
);
