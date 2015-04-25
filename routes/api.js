var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var config = require('../config/config.json');
//var config = JSON.parse(fs.readFileSync(configFile, 'utf8'));

var options = {};

router.route('/getserverlist')
    .post(function(req, res){
        res.send(config);
    });

router.route('/addserver')
    .post(function(req,res){
        if(validServerConfigObject(req.body)) {
            config.push(req.body);
            fs.writeFile('config/config.json', JSON.stringify(config), function(err){
                if (err) return console.log(err);
                res.send('Success')
            });
        } else {
            res.send('Invalid ServerConfigObject');
        }


    });

router.route('/getinfo')
	.post(function(req, res){
        setServer(req.body.index);
        options.body.method = 'getinfo';
        request(options, function(err, response, body) {
            res.send(body);
        });
	});

router.route('/listtransactions')
    .post(function(req,res){
        setServer(req.body.index);
       options.body.method = 'listtransactions';
        request(options, function(err,response,body){
            res.send(body);
        })
    });

router.route('/listaccounts')
    .post(function(req,res){
        options.body.method = 'listaccounts';
        setServer(req.body.index);
        request(options, function(err,response,body){
            res.send(body);
        })
    });

function setServer(index){
    if(!index){
        index = 0;
    }
    options = {
        url: 'http://'+config[index].server+':'+config[index].rpcport
        , method: 'POST'
        , headers: {
            'Content-Type': 'application/json'
        }
        , 'auth': {
            'user': config[index].rpcuser,
            'pass': config[index].rpcpassword,
            'sendImmediately': false
        }
        , body: {
            "method":""
        }
        , json: true
    };
}

function validServerConfigObject(obj){
    return !(!obj.name || !obj.coin || !obj.server || !obj.rpcuser || !obj.rpcpassword || !obj.rpcport);
}

module.exports = router;