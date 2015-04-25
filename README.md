# RaspPaycoin
Raspberry PI Paycoin Web Wallet

## Prerequisites

### Node.JS
To install Node.JS run the following commands for `Ubuntu`

`sudo add-apt-repository ppa:chris-lea/node.js`

`sudo apt-get update`

`sudo apt-get install <package name>`

## Setup

Once you have Node.Js installed in the root directory run `npm install`. Let everything install and then `cd public`.

In the public directory, this is your Angular directory, type `bower install`. If this fails, run `npm bower install --save` then try `bower install`

## Config 

Rename the `/config/config.changeme.json` to `config.json`
 
Within the `config.json` change the rpcuser, rpcpassword, and rpcport to what ever is set in your `paycoin.conf`.

## Run the server

From the root directory run `npm start`

## Contribute

Please feel free to submit pull requests. This is a work in progress at the moment and we welcome any input.
The views are just a free bootstrap admin panel ([SB Bootstrap 2](http://startbootstrap.com/template-overviews/sb-admin-2/)). If you want to skin the UI, please fork and skin it and submit a pull request.