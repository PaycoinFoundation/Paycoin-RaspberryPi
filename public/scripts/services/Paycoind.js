angular.module('PaycoinRpiWallet')
    .factory('paycoind', function($http, $q){

        var service = {
            serverIndex: -1,
            setServerIndex: setServerIndex,
            getInfo: getInfo,
            listTransactions: listTransactions,
            listAccounts: listAccounts,
            getServerInfo: getServerInfo,
            listAllTransactions: listAllTransactions,
            listAddressTransactions: listAddressTransactions,
            listMinting: listMinting,
            addServer:addServer,
            sendToAddress: sendToAddress,
            saveSendAddress: saveSendAddress,
            saveDataJSON: saveDataJSON,
            unlock: unlock,
            walletlock: walletlock,
            getPeerInfo: getPeerInfo,
            getNewAddress: getNewAddress,
            getRawTransaction: getRawTransaction,
            decodeRawTransaction: decodeRawTransaction,
            getTransaction: getTransaction,
            basicInfo: {}
        };

        function getTransaction(txid){
            var deferred = $q.defer();

            var payload = {
                index:this.serverIndex,
                txid: txid
            };

            $http.post('/api/gettransaction',payload)
                .then(function(response){
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function getRawTransaction(txid){
            var deferred = $q.defer();

            var payload = {
                index:this.serverIndex,
                txid: txid
            };

            $http.post('/api/getrawtransaction',payload)
                .then(function(response){
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function decodeRawTransaction(rawtrans){
            var deferred = $q.defer();

            var payload = {
                index:this.serverIndex,
                rawtrans: rawtrans
            };

            $http.post('/api/decoderawtransaction',payload)
                .then(function(response){
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function getNewAddress(label){
            var deferred = $q.defer();

            var payload = {
                index:this.serverIndex,
                account: label
            };

            $http.post('/api/getnewaddress', payload)
                .then(function(response){
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function getPeerInfo(){
            var deferred = $q.defer();

            $http.post('/api/peerinfo',{index:this.serverIndex})
                .then(function(response){
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function unlock(passphrase, timeout){
            var deferred = $q.defer();

            var payload = {
                index: this.serverIndex,
                passphrase: passphrase,
                timeout: timeout
            };

            $http.post('/api/unlock', payload)
                .then(function(response){
                    console.log(response);
                    deferred.resolve(response.data);
                });

            return deferred.promise;
        }

        function walletlock(){
            $http.post('/api/walletlock',{index:this.serverIndex})
                .then(function(response){
                    console.log("wallet lock response");
                    console.log(response);
                })
        }

        function sendToAddress(sendPayload){

            var deferred = $q.defer();

            var payload = {
                index: this.serverIndex,
                paycoindaddress: sendPayload.paycoinaddress,
                amount: sendPayload.amount
            };

            if(sendPayload.passphrase){
                payload.passphrase = sendPayload.passphrase;
            }

            $http.post('/api/sendtoaddress', payload)
                .then(function(response){
                    deferred.resolve(response.data);
                });

            return deferred.promise;
        }

        function saveSendAddress(address, label){
            var deferred = $q.defer();

            var payload = {
                index: this.serverIndex,
                label: label,
                address: address
            };

            $http.post('/api/addtoaddressbook', payload)
                .then(function(response){

                    deferred.resolve(response.data);
                });

            return deferred.promise;
        }

        function saveDataJSON(){

        }

        function addServer(newserver){
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

        function listAddressTransactions(address){
            var deferred = $q.defer();
            $http.post('/api/listaddresstransactions', { 'index' : this.serverIndex, 'address': address} )
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