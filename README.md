# RaspPaycoin
Raspberry PI Paycoin Web Wallet

## Prerequisites

### Node.JS

#### On the rPi
To install Node.JS on the Raspberry Pi run the following commands for `Ubuntu`

Download a prebuilt ARM version of node.js by running this command:
 
`wget http://nodejs.org/dist/v0.10.28/node-v0.10.28-linux-arm-pi.tar.gz`

then run:

'cd /usr/local && sudo tar --strip-components 1 -xzf ~/node-v0.10.28-linux-arm-pi.tar.gz`

You will likely be prompted for a password because of sudo.

#### On Linux (ubuntu)

Add the PPA
`sudo add-apt-repository ppa:chris-lea/node.js`

Update download servers
`sudo apt-get update`

Install Node.js
`sudo apt-get install nodejs`

## Setup

Once you have Node.Js installed. In the root directory of the project run `npm install`. Let everything install and then `cd public`.

In the public directory, this is your Angular directory, type `bower install`. If this fails, run `npm install bower --save` then try `bower install`

## Config 

Rename the `/config/config.changeme.json` to `config.json`
 
Within the `config.json` change the rpcuser, rpcpassword, and rpcport to what ever is set in your `paycoin.conf`.

## Run the server

From the root directory run `npm start`

## Contribute

Please feel free to submit pull requests. This is a work in progress at the moment and we welcome any input.
The views are just a free bootstrap admin panel ([SB Bootstrap 2](http://startbootstrap.com/template-overviews/sb-admin-2/)). If you want to skin the UI, please fork and skin it and submit a pull request.