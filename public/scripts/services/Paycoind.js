angular.module('PaycoinRpiWallet')
    .factory('paycoind', function($http, $q, $localStorage, $rootScope){

        var service = {
            serverIndex: -1,
            setServerIndex: setServerIndex,
            getInfo: getInfo,
            listTransactions: listTransactions,
            listAccounts: listAccounts,
            getServerInfo: getServerInfo,
            listAllTransactions: listAllTransactions,
            listMinting: listMinting,
            addserver:addserver,
            basicInfo: {}
        };

        function addserver(newserver){
            var deferred = $q.defer();
            $http.post('/api/addserver', newserver)
                .then(function(response){
                    deferred.resolve(response.data);
                });
            return deferred.promise;
        }

        function listAllTransactions(){
            var deferred = $q.defer();
            $http.post('/api/listalltransactions', { 'index' : this.serverIndex, 'account': '*'} )
                .then(function(response){
                    deferred.resolve(response.data);
                });

            return deferred.promise;
        }

        function setServerIndex(index){
            this.serverIndex = index;
        }

        function getInfo(){
            var deferred = $q.defer();
            $http.post('/api/getinfo',  { 'index' : this.serverIndex })
                .then(function(response){
                    service.basicInfo = response.data;
                    deferred.resolve(response.data);
                });
            return deferred.promise;
        }

        function listTransactions(qty){
            var deferred = $q.defer();

            if(qty == null)
                qty = 10;

            $http.post('/api/listrecenttransactions',  {'index':this.serverIndex, qty: parseInt(qty)})
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
                        payload.account = key.name;

                        $http.post('/api/getaddressesbyaccount', { 'index':service.serverIndex, 'account': key.name })
                            .then(function(response){
                                key.addresses = response.data;
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

        function listMinting(){
            var deferred = $q.defer();

            $http.post('/api/listminting', {'index':this.serverIndex})
                .then(function(response){
                   deferred.resolve(response.data);
                });

            return deferred.promise;
        }

        return service;
    }
);