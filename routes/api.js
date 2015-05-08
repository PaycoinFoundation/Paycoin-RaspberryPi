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

router.route('/addserver')
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
            res.send('Invalid ServerConfigObject');
        }
    });

router.route('/getinfo')
	.post(function(req, res){
        setServer(req.body.index);
        client.getInfo(function(err,info){
            if(info)
                res.send(info);
        })
	});

router.route('/listalltransactions')
    .post(function(req,res){
        setServer(req.body.index);

        var num = 10000;

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

        client.walletPassphrase(req.body.passphrase, req.body.timeout, function(err, response){
            if(err) res.send(err);
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
        console.log("body");
        console.log(req.body);
        console.log("dataJSON.addressBookOutgoing");
        console.log(dataJSON.addressBookOutgoing);
        var pos = dataJSON.addressBookOutgoing.indexOf(req.body);
        console.log("position");
        console.log(pos);
        dataJSON.addressBookOutgoing.splice(pos,1);
        res.send("removed at " + pos);
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