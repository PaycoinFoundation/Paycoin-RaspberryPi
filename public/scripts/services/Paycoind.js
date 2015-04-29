angular.module('PaycoinRpiWallet')
    .factory('paycoind', function($http, $q, $rootScope){

        var service = {
            serverIndex: -1,
            setServerIndex: setServerIndex,
            getInfo: getInfo,
            listTransactions: listTransactions,
            listAccounts: listAccounts,
            getServerInfo: getServerInfo
        };

        function setServerIndex(index){
            this.serverIndex = index;
        }

        function getInfo(){
            var deferred = $q.defer();
            $http.post('/api/getinfo',  {'index':this.serverIndex})
                .then(function(response){
                    console.log(response.data);
                    deferred.resolve(response.data);
                });
            return deferred.promise;
        }

        function listTransactions(){
            var deferred = $q.defer();
            $http.post('/api/listtransactions',  {'index':this.serverIndex})
                .then(function(response){
                    deferred.resolve(response.data);
                });

            return deferred.promise;
        }

        function listAccounts(){
            var deferred = $q.defer();
            $http.post('/api/listaccounts',  {'index':this.serverIndex})
                .then(function(response){
                    var accounts = response.data;

                    var payload = {
                        'index':service.serverIndex,
                        'account':''
                    };

                    accounts.forEach(function(key){
                        console.log(key.name);
                        payload.account = key.name;

                        $http.post('/api/getaddressesbyaccount', { 'index':service.serverIndex, 'account': key.name })
                            .then(function(response){
                                //console.log(response.config);
                                key.addresses = response.data;
                                console.log(key);
                            });
                    });

                    deferred.resolve(accounts);
                });

            return deferred.promise;
        }

        function getServerInfo(){
            var deferred = $q.defer();
            $http.post('/api/getserverlist',  {'index':this.serverIndex})
                .then(function(response){
                    deferred.resolve(response.data);
                });

            return deferred.promise;
        }

        return service;
    }
);