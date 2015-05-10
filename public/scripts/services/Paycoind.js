angular.module('PaycoinRpiWallet')
    .factory('paycoind', function($http, $q){

        var service = {
            checkWallet: checkWallet,
            decodeRawTransaction: decodeRawTransaction, // <hex string>
            dumpPrivKey: dumpPrivKey, // <paycoinaddress>
            getAccount: getAccount, // <paycoinaddress>
            getAccountAddress: getAccountAddress,
            getAddressesByAccount: getAddressesByAccount,
            getBlock: getBlock, // <hash> [txinfo] [txdetails]
            getBalance: getBalance, // [account] [minconf=1]
            getBlockCount: getBlockCount,
            getBlockHash: getBlockHash, // <index>
            getBlockTemplate: getBlockTemplate, // [params]
            getCheckpoint: getCheckpoint,
            getConnectionCount: getConnectionCount,
            getDifficulty: getDifficulty,
            getGenerate: getGenerate,
            getHashesPerSec: getHashesPerSec,
            getInfo: getInfo,
            getMiningInfo: getMiningInfo,
            getNetworkGHps: getNetworkGHps,
            getNewAddress: getNewAddress, // [account]
            getPeerInfo: getPeerInfo,
            getRawMemPool: getRawMemPool,
            getRawTransaction: getRawTransaction, // <txid> [verbose=0]
            getReceivedByAccount: getReceivedByAccount, // <account> [minconf=1]
            getReceivedByAddress: getReceivedByAddress, // <paycoinaddress> [minconf=1]
            getTransaction: getTransaction,
            getTxOut: getTxOut, // "txid" n (includemempool)
            getWork: getWork, // [data]
            help: help,
            importPrivKey:importPrivKey, // <paycoinprivkey> [label]
            keyPoolRefill: keyPoolRefill,
            listAccounts: listAccounts,
            listAddressGroupings: listAddressGroupings,
            listMinting: listMinting, //[count=-1] [from=0]
            listReceivedByAccount:listReceivedByAccount, //[minconf=1] [includeempty=false]
            listReceivedByAddress:listReceivedByAddress, // [minconf=1] [includeempty=false]
            listSinceBlock:listSinceBlock, //[blockhash] [target-confirmations]
            listTransactions: listTransactions, //[account] [count=10] [from=0]
            listUnspent:listUnspent, //[minconf=1] [maxconf=9999999] ["address",...]
            makeKeyPair:makeKeyPair, //[prefix]
            move:move,// <fromaccount> <toaccount> <amount> [minconf=1] [comment]
            repairWallet:repairWallet,
            reserveBalance:reserveBalance,// [<reserve> [amount]]
            sendAlert:sendAlert, // <message> <privatekey> <minver> <maxver> <priority> <id> [cancelupto]
            sendfrom:sendFrom, // <fromaccount> <topaycoinaddress> <amount> [minconf=1] [comment] [comment-to]
            sendMany :sendMany,//<fromaccount> {address:amount,...} [minconf=1] [comment]
            sendRawTransaction: sendRawTransaction, //<hex string> [checkinputs=0]
            sendToAddress: sendToAddress,// <paycoinaddress> <amount> [comment] [comment-to]
            setAccount: setAccount, //<paycoinaddress> <account>
            setGenerate: setGenerate, // <generate> [genproclimit]
            setTxFee: setTxFee, //<amount>
            signMessage:signMessage, //<paycoinaddress> <message>
            signRawTransaction: signRawTransaction, // <hex string> [{"txid":txid,"vout":n,"scriptPubKey":hex},...] [<privatekey1>,...] [sighashtype="ALL"]
            stop: stop,
            submitBlock: submitBlock, //<hex data> [optional-params-obj]
            validateAddress:validateAddress, // <paycoinaddress>
            verifyMessage: verifyMessage, // <paycoinaddress> <signature> <message>
            walletLock: walletlock,
            walletPassphrase: walletPassphrase, // <passphrase> <timeout> [mintonly]
            walletPassphraseChange: walletPassphraseChange, // <oldpassphrase> <newpassphrase>

            listAllTransactions: listAllTransactions,
            listAddressTransactions: listAddressTransactions,
            saveSendAddress: saveSendAddress,
            unlock: unlock,
            saveDataJSON: saveDataJSON,
            addServer:addServer,
            serverIndex: -1,
            basicInfo: {},
            getServerInfo: getServerInfo,
            setServerIndex: setServerIndex
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