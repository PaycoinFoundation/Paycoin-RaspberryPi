# RaspPaycoin
Raspberry PI Paycoin Web Wallet

## Prerequisites

### Node.JS

#### On the rPi
To install Node.JS on the Raspberry Pi run the following commands.

Download a prebuilt ARM version of node.js by running this command:

`wget http://nodejs.org/dist/v0.10.28/node-v0.10.28-linux-arm-pi.tar.gz`

then run:

`cd /usr/local && sudo tar --strip-components 1 -xzf ~/node-v0.10.28-linux-arm-pi.tar.gz`

You will likely be prompted for a password because of sudo.

#### On Linux (ubuntu 14.04)

Note: 15.04 seems to be pretty new and nodejs is not built for it yet. If you get node installed it'll work otherwise stick to 14.04.

* Add the PPA
`sudo add-apt-repository ppa:chris-lea/node.js`

* Update download servers
`sudo apt-get update`

* Install Node.js
`sudo apt-get install nodejs`

* Install Python Software Properties (a pre-requisite)
`sudo apt-get install python-software-properties`

* Install SQLite
`sudo apt-get install sqlite3 libsqlite3-dev`

* Install Git
`sudo apt-get install git`

## Setup

Clone this repository
`git clone https://github.com/tvl83/RaspPaycoin <directory>`.
The `<directory>` is optional if you do not want the default folder name of `RaspPaycoin`.

In the root directory of the project run `npm install` and `sudo npm install bower -g`. Let everything install, then `cd public` and run `bower install`.

## Config 

Rename the `/config/config.changeme.json` to `config.json` with `mv config.changeme.json config.json`
 
Within the `config.json` change the rpcuser, rpcpassword, and rpcport to what ever is set in your `paycoin.conf`.

The `paycoin.conf` that is on the raspberryPi is configured with the default settings so you wont have to do anything. On any other system you need to set it to the correct parameters.

## Run the server

From the root directory run `npm start`

When started, you may point your browser to `localhost:3000`

## Contribute

Please feel free to submit pull requests. This is a work in progress at the moment and we welcome any input.
The views are just a free bootstrap admin panel ([SB Bootstrap 2](http://startbootstrap.com/template-overviews/sb-admin-2/)). If you want to skin the UI, please fork and skin it and submit a pull request.

This project is supported by the community. 

BTC: `1Q2ZEQcMftL6tGKVXWNobwTZDFVDQx2aGM`

XPY: `PURNbr88icJ7YX47o6jrdWSh7PQzfrKWrk`

Any donations are greatly appreciated. This is a project created 100% for free on a volunteer basis.

Thank you!
