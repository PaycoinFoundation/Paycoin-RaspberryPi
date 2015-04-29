'use strict';

angular.module('PaycoinRpiWallet', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ngStorage'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .otherwise('/dashboard');
        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                controller: 'DashboardCtrl',
                templateUrl: 'views/dashboard.html'
            })
            .state('send', {
                url: '/send',
                controller: 'SendCtrl',
                templateUrl: 'views/send.html'
            })
            .state('receive', {
                url: '/receive',
                controller: 'ReceiveCtrl',
                templateUrl: 'views/receive.html'
            })
            .state('transactions', {
                url: '/transactions',
                controller: 'TransactionsCtrl',
                templateUrl: 'views/transactions.html'
            })
            .state('minting', {
                url: '/minting',
                controller: 'MintingCtrl',
                templateUrl: 'views/minting.html'
            })
            .state('addressbook', {
                url: '/addressbook',
                controller: 'AddressbookCtrl',
                templateUrl: 'views/addressbook.html'
            })
            .state('peerinfo', {
                url: '/peerinfo',
                controller: 'PeerInfoCtrl',
                templateUrl: 'views/peerinfo.html'
            })
            .state('options', {
                url: '/options',
                controller: 'OptionsCtrl',
                templateUrl: 'views/options.html'
            })
            .state('about', {
                url: '/about',
                controller: 'AboutCtrl',
                templateUrl: 'views/about.html'
            })
            .state('contribute', {
                url: '/contribute',
                controller: 'ContributeCtrl',
                templateUrl: 'views/contribute.html'
            })
  })
    .controller('MainCtrl', function ($scope, $rootScope, $localStorage, paycoind) {
        paycoind.getServerInfo()
            .then(function(response){
                $localStorage.serverList = response;
                $scope.serverList = response;
            });

        $scope.changeServer = function(index){
            console.log(index);
            paycoind.setServerIndex(index);
            $localStorage.chosenServer = $localStorage.serverList[index];
            $scope.chosenServer = $localStorage.serverList[index];
            paycoind.getInfo()
                .then(function (response) {
                    $rootScope.getInfo = response;
                }
            );
            paycoind.listTransactions()
                .then(function(response){
                    $rootScope.listTransactions = response;
                });
        };

        paycoind.setServerIndex(0);

        $localStorage.chosenServer = $localStorage.serverList[0];
        $scope.chosenServer = $localStorage.serverList[0];

        $localStorage.app = $rootScope.app;
    }
)
    .run(function($rootScope){
        $rootScope.app = {
            name: 'RaspberryPi Wallet',
            version: '0.1.0 (04292015)',
            curTitle: ''
        };
    });