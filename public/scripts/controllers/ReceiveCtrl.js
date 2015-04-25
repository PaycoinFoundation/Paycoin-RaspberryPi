'use strict';

angular.module('PaycoinRpiWallet')
    .controller('ReceiveCtrl', function ($scope, $rootScope, $http) {
        $rootScope.app.curTitle = "Receive";

        $http.get('/api/listaccounts')
            .then(function(response){
                console.log(response);
                $scope.getInfo = response.data.result;


                $http.get('/api/listTransactions')
                    .then(function(response){
                        console.log(response);
                        $rootScope.listTransactions = response.data.result;
                    })

            });


    }
);
