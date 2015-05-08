'use strict';

angular.module('PaycoinRpiWallet')
    .controller('PeerInfoCtrl', function ($scope, $rootScope, paycoind) {
        $rootScope.app.curTitle = "Peer Info";

        paycoind.getPeerInfo()
            .then(function(response){
                console.log(response.data);
                $scope.peers = response.data;
            })
    }
);
