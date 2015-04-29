var express = require('express');
var router = express.Router();
var fs = require('fs');
var configJSON = require('../config/config.json');
var addressesJSON = require('../data/addresses.json');
var transactionsJSON = require('../data/transactions.json');

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

router.route('/listtransactions')
    .post(function(req,res){
        setServer(req.body.index);

        client.listTransactions(function(err,transactions){
            if(transactions)
                res.send(transactions);
            else
                res.send(err);
        });
    }
);

router.route('/getaddressesbyaccount')
    .post(function(req,res){
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