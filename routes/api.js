var express = require('express');
var router = express.Router();
var fs = require('fs');
var configJSON = require('../config/config.json');
var dataJSON = require('../data/data.json');

var bitcoin = require('bitcoin');
var client;

//var config = JSON.parse(fs.readFileSync(configFile, 'utf8'));

var options = {};

router.route('/getserverlist')
    .post(function(req, res){
        res.send(configJSON);
    });

router.route('/addnode')
    .post(function(req,res){
        if(validServerConfigObject(req.body)) {
            configJSON.push(req.body);
            fs.writeFile('config/config.json', JSON.stringify(configJSON, null, 4), function(err){
                if (err) return console.log(err);
                res.send({
                    success: true
                })
            });
        } else {
            res.send({error:'Invalid ServerConfigObject'});
        }
    });

router.route('/getinfo')
	.post(function(req, res){
        setServer(req.body.index);
        client.getInfo(function(err,info){
            if(err) res.send(err);
            if(info)
                res.send(info);
        })
	});

router.route('/listalltransactions')
    .post(function(req,res){
        setServer(req.body.index);

        var num = 10000;

        console.log("serverIndex: " + req.body.index + ", account: " + req.body.account + ", num: " + num);

        client.listTransactions(req.body.account, num, function(err,transactions){
            if(err) res.send(err);

            res.send(transactions);
        });
    }
);
router.route('/listaccounttransactions')
    .post(function(req,res){
        setServer(req.body.index);

        var num = req.body.qty || 1000;

        client.listTransactions(req.body.account, num, function(err,transactions){
            if(transactions)
                res.send(transactions);
            else {
                console.log(err);
                res.send(err);
            }
        });
    }
);
router.route('/listrecenttransactions')
    .post(function(req,res){
        setServer(req.body.index);

        client.listTransactions("*", req.body.qty, function(err,transactions){
            if(transactions)
                res.send(transactions);
            else {
                console.log(err);
                res.send(err);
            }
        });
    }
);

router.route('/getaddressesbyaccount')
    .post(function(req,res){
        setServer(req.body.index);
        client.getAddressesByAccount(req.body.account, function(err,addresses){
            res.send(addresses);
        });
    });

router.route('/listaccounts')
    .post(function(req,res){
        setServer(req.body.index);

        client.listAccounts(function(err,accts){
            if(err) {
                res.send(err);
            }

            var accounts = [];

            for (var k in accts) {
                var temp = {
                    name: '',
                    balance: 0,
                    addresses: []
                };

                temp.name = k;
                temp.balance = accts[k];

                accounts.push(temp);
            }
            res.send(accounts);
        });
    });

router.route('/listminting')
    .post(function(req,res){
       setServer(req.body.index);
        client.cmd('listminting',function(err,mint){
            if(err) res.send(err);
            res.send(mint);
        })
    });

router.route('/addtoaddressbook')
    .post(function(req,res){
        dataJSON.addressBookOutgoing.push(req.body);
        fs.writeFile('data/data.json', JSON.stringify(dataJSON, null, 4), function(err){
            if (err) return console.log(err);
            res.send(dataJSON.addressBookOutgoing);
        });
    });

router.route('/sendtoaddress')
    .post(function(req,res){
        //console.log(req.body);
        setServer(req.body.index);
        client.sendToAddress(req.body.paycoinaddress, parseFloat(req.body.amount), function(err,response){
            if(err) {
                console.log(err);
                res.send(err);
            }
            console.log(response);
            res.send(response);
        })
    });

router.route('/walletlock')
    .post(function(req,res){
        setServer(req.body.index);
        console.log(req.body);
        client.walletLock(function(err,response){
           if(err) res.send(err);
           res.send("success")
        });
    });

router.route('/unlock')
    .post(function(req,res){
        setServer(req.body.index);
        console.log(req.body);
        //var timeout = res.body.timeout || 120;
        client.walletPassphrase(req.body.passphrase, req.body.timeout, req.body.stakingOnly, function(err, response){
            if(err) {
                // source https://github.com/bitcoin/bitcoin/blob/master/src/rpcprotocol.h#L34
                // code -14 = bad passphrase RPC_WALLET_PASSPHRASE_INCORRECT = -14, //! The wallet passphrase entered was incorrect
                // code -15 = not encrypted RPC_WALLET_WRONG_ENC_STATE      = -15, //! Command given in wrong wallet encryption state (encrypting an encrypted wallet etc.)
                // -17, "Error: Wallet is already unlocked, use walletlock first if need to change unlock settings.");

                // response is not valid JSON
                //{ [Error: Error: The wallet passphrase entered was incorrect.] code: -14 }
                console.log(err);
                if(err.code == -14) {
                    res.send({error: { msg: "Bad Passphrase"}});
                }
                else if( err.code == -15) {
                    res.send("Wallet not encrypted");
                }
                else if( err.code == -17) {
                    res.send("Error: Wallet is already unlocked, use walletlock first if need to change unlock settings.");
                }
                else {
                    res.send(err);
                }
            }
            console.log("walletpassphrase response");
            console.log(response);
            res.send(response);
        });
    });

router.route('/addaddress')
    .post(function(req,res){
        dataJSON.addressBookOutgoing.push(req.body);
        fs.writeFile('data/data.json', JSON.stringify(dataJSON, null, 4), function(err){
            if (err) return console.log(err);
            res.send(dataJSON.addressBookOutgoing);
        });
    });

router.route('/getaddressbook')
    .get(function(req,res){
        res.send(dataJSON.addressBookOutgoing);
    });

router.route('/removeaddress')
    .post(function(req,res){
        var pos = dataJSON.addressBookOutgoing.indexOf(req.body);
        dataJSON.addressBookOutgoing.splice(pos,1);
        res.send("removed at " + pos);
    });

router.route('/peerinfo')
    .post(function(req,res){
        setServer(req.body.index);
        client.getPeerInfo(function(err, response){
            if(err) res.send(err);
            res.send(response);
        })
    });

router.route('/getnewaddress')
    .post(function(req,res){
        setServer(req.body.index);
        client.getNewAddress(req.body.account, function(err,response){
            if(err) res.send(err);
            res.send(response);
        })
    });

router.route('/getrawtransaction')
    .post(function(req,res){
        setServer(req.body.index);
        client.getRawTransaction(req.body.txid, function (err,response){
            if(err) res.send(err);
            res.send(response);
        })
    });

router.route('/gettransaction')
    .post(function(req,res){
        setServer(req.body.index);
        client.getTransaction(req.body.txid, function (err,response){
            if(err) res.send(err);
            res.send(response);
        })
    });

router.route('/decoderawtransaction')
    .post(function(req,res){
        setServer(req.body.index);
        client.decodeRawTransaction(req.body.rawtrans, function (err,response) {
            if (err) res.send(err);
            res.send(response);
        })
    });

router.route('/listaddresstransactions')
    .post(function(req,res){
        setServer(req.body.index);
        var account;
        client.getAccount(req.body.address, function(err, response){
            account = response;
            client.listTransactions(account,function(err,response){
                if (err) res.send(err);
                res.send(response);
            })
        });
    });

function setServer(index){
    if(!index){
        index = 0;
    }

    client = new bitcoin.Client({
        host: configJSON[index].server,
        port: configJSON[index].rpcport,
        user: configJSON[index].rpcuser,
        pass: configJSON[index].rpcpassword,
        timeout: 30000
    });
}

function validServerConfigObject(obj){
    return !(!obj.name || !obj.coin || !obj.server || !obj.rpcuser || !obj.rpcpassword || !obj.rpcport);
}

module.exports = router;