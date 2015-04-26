angular.module('PaycoinRpiWallet')
    .factory('paycoind', function($http, $q, $rootScope){

        var service = {
            serverIndex: $rootScope.app.serverIndex,
            setServerIndex: setServerIndex,
            getInfo: getInfo,
            listTransactions: listTransactions,
            listAccounts: listAccounts
        };

        var payload = {'index':service.serverIndex};

        function setServerIndex(index){
            service.serverIndex = index;
        }

        function getInfo(){
            var deferred = $q.defer();
            $http.post('/api/getinfo', payload)
                .then(function(response){
                    deferred.resolve(response.data.result);
                });
            return deferred.promise;
        }

        function listTransactions(){
            var deferred = $q.defer();
            $http.post('/api/listtransactions', payload)
                .then(function(response){
                    deferred.resolve(response.data.result);
                });

            return deferred.promise;
        }

        function listAccounts(){
            var deferred = $q.defer();
            $http.post('/api/listaccounts', payload)
                .then(function(response){
                    deferred.resolve(response.data.result);
                });

            return deferred.promise;
        }

        return service;
    }
);