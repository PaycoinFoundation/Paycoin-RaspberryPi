'use strict';

angular.module('PaycoinRpiWallet')
    .controller('OptionsCtrl', function ($scope, $rootScope, paycoind) {
        $rootScope.app.curTitle = "Options";

        $scope.addserver = function(){
            paycoind.addserver($scope.newserver)
                .then(function(response){
                    console.log(response);
                });
        }

    }
);
